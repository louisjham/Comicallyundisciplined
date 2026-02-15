import React, { useState, useCallback, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import { ComicStrip, AppMode, ReportSummary } from './types';
import { UI_TEXT } from './constants/content';
import ComicPanel from './components/ComicPanel';
import LoadingState, { LoadingPhase } from './components/LoadingState';
import ArchiveLocker from './components/ArchiveLocker';
import ReportViewer from './components/ReportViewer';
import LandingPage from './components/LandingPage'; // Import the new LandingPage component

const App: React.FC = () => {
  const [comic, setComic] = useState<ComicStrip | null>(null);
  // Renamed from isAppInitialized to clearly reflect the user's action to start the app's main flow
  const [hasInvestigationStarted, setHasInvestigationStarted] = useState<boolean>(false); 
  
  const [allHardcodedReports, setAllHardcodedReports] = useState<ReportSummary[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportSummary | null>(null);
  
  const [isGeneratingComic, setIsGeneratingComic] = useState<boolean>(false);
  const [currentLoadingPhase, setCurrentLoadingPhase] = useState<LoadingPhase>('INITIAL');

  const [mode, setMode] = useState<AppMode>('gritty');
  const [error, setError] = useState<{ message: string; isQuota?: boolean; isBusy?: boolean } | null>(null);
  
  const [archive, setArchive] = useState<ComicStrip[]>([]);
  const [isLockerOpen, setIsLockerOpen] = useState<boolean>(false);

  // New state to track shown report indexes for the current cycle of 75 reports
  const [shownReportIndexes, setShownReportIndexes] = useState<Set<number>>(new Set());

  // Function to get a random, as-yet-unseen report
  const getRandomUnseenReport = useCallback((reports: ReportSummary[]): ReportSummary | null => {
    if (!reports || reports.length === 0) return null;

    let availableIndexes = Array.from({ length: reports.length }, (_, i) => i)
      .filter(index => !shownReportIndexes.has(index));

    // If all reports have been shown, reset the tracking and allow repeats
    if (availableIndexes.length === 0) {
      setShownReportIndexes(new Set());
      availableIndexes = Array.from({ length: reports.length }, (_, i) => i);
      console.log("All unique reports shown. Resetting cycle.");
    }

    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    
    setShownReportIndexes(prev => new Set(prev).add(randomIndex));
    return reports[randomIndex];
  }, [shownReportIndexes]); // Depend on shownReportIndexes to trigger re-calculation when it changes

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      if (error?.isQuota) {
        setError(null); 
      }
    }
  };

  const clearCurrentComic = () => {
    setComic(null);
    setError(null);
    setIsGeneratingComic(false);
    setCurrentLoadingPhase('INITIAL');
  }

  // Function to handle loading the next random report
  const handleGenerateRandomReport = useCallback(() => {
    clearCurrentComic(); // Clear any existing comic
    setCurrentLoadingPhase('INITIAL'); // Show loading state when fetching next report
    const nextReport = getRandomUnseenReport(allHardcodedReports);
    setSelectedReport(nextReport);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allHardcodedReports, getRandomUnseenReport]);

  // New function to start the investigation from the landing page
  const handleStartInvestigation = useCallback(() => {
    setHasInvestigationStarted(true);
    handleGenerateRandomReport(); // Load the first random report
  }, [handleGenerateRandomReport]);


  useEffect(() => {
    const loadData = async () => {
      const savedComics = await storageService.getAllComics();
      setArchive(savedComics);
      
      const hardcoded = geminiService.getHardcodedReports();
      
      // Shuffle the hardcoded reports once on initial load for random order on each visit
      const shuffledReports = [...hardcoded]; // Create a copy to avoid modifying original array
      for (let i = shuffledReports.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledReports[i], shuffledReports[j]] = [shuffledReports[j], shuffledReports[i]];
      }
      
      setAllHardcodedReports(shuffledReports); // Store the shuffled reports
      
      // Do NOT set selectedReport or hasInvestigationStarted here.
      // These will be set by handleStartInvestigation after user interaction.
    };
    loadData();
  }, []); // Empty dependency array as getRandomUnseenReport should not trigger this initial load

  const generateComicStrip = useCallback(async (report: ReportSummary) => {
    setIsGeneratingComic(true);
    setCurrentLoadingPhase('COMIC_GENERATION');
    setError(null);
    setComic(null);

    try {
      const script = await geminiService.generateComicScript(report, mode);
      
      const initialTimestamp = Date.now();
      const initialComic: ComicStrip = { 
        ...script, 
        panels: script.panels.map(p => ({ ...p, imageUrl: undefined })), 
        timestamp: initialTimestamp 
      };

      setComic(initialComic);
      
      const updatedPanels = [...initialComic.panels];
      
      const panelPromises = script.panels.map(async (panel, idx) => {
        try {
          const imageUrl = await geminiService.generatePanelImage(panel.visualPrompt, mode);
          
          setComic(current => {
            if (!current || current.timestamp !== initialTimestamp) return current;
            const newPanels = [...current.panels];
            newPanels[idx] = { ...newPanels[idx], imageUrl };
            return { ...current, panels: newPanels };
          });

          updatedPanels[idx] = { ...updatedPanels[idx], imageUrl };
        } catch (imgErr) {
          console.error(`Failed image for panel ${idx}:`, imgErr);
        }
      });

      await Promise.all(panelPromises);
      
      const finalComic: ComicStrip = {
        ...initialComic,
        panels: updatedPanels
      };

      setComic(current => {
         if (current?.timestamp === initialTimestamp) {
            storageService.saveComic(finalComic).then(() => {
              storageService.getAllComics().then(setArchive);
            });
         }
         return current;
      });

    } catch (err: any) {
      console.error(err);
      const isQuota = err.message?.includes('429') || err.message?.toLowerCase().includes('limit');
      const isBusy = err.message?.includes('503') || err.message?.toLowerCase().includes('demand') || err.message?.toLowerCase().includes('unavailable');
      
      let errorMessage = err.message || "An unexpected error occurred during comic generation.";
      if (isQuota) errorMessage = UI_TEXT.ERRORS.QUOTA_SUB;
      else if (isBusy) errorMessage = UI_TEXT.ERRORS.BUSY_SUB;

      setError({ 
        message: errorMessage,
        isQuota,
        isBusy
      });
      setComic(null);
    } finally {
      setIsGeneratingComic(false);
      setCurrentLoadingPhase('INITIAL');
    }
  }, [mode]);

  const selectArchivedComic = (selected: ComicStrip) => {
    setComic(selected);
    setSelectedReport(null); // Clear selected report when viewing archive
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine global loading state for disabling buttons
  const isLoadingAny = isGeneratingComic || (hasInvestigationStarted && !selectedReport && allHardcodedReports.length > 0);

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-500 ${mode === 'superhero' ? 'bg-yellow-50' : 'bg-gray-100'}`}>
      <header className="bg-black text-white p-6 shadow-xl border-b-4 border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            {/* Updated title font, removed italic, adjusted tracking */}
            <h1 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight leading-none text-white">{UI_TEXT.TITLE}</h1>
            {/* Updated subtitle color and tracking */}
            <p className="text-gray-400 font-bold text-xs tracking-wide uppercase mt-1">{UI_TEXT.SUBTITLE}</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex bg-gray-800 p-1 comic-border border-white border-2">
              <button onClick={() => setMode('gritty')} className={`px-4 py-1 text-xs font-bold uppercase ${mode === 'gritty' ? 'bg-white text-black' : 'text-gray-400'}`}>Gritty Noir</button>
              <button onClick={() => setMode('superhero')} className={`px-4 py-1 text-xs font-bold uppercase ${mode === 'superhero' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>Heroic Fail</button>
            </div>

            <button onClick={() => setIsLockerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-white hover:bg-gray-800 relative group" disabled={isLoadingAny}>
              <span className="text-xl">🗄️</span>
              <span className="text-[10px] font-bold uppercase hidden md:inline">{UI_TEXT.BUTTONS.VIEW_LOCKER}</span>
              {archive.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white font-bold">
                  {archive.length}
                </span>
              )}
            </button>

            <button onClick={handleOpenKeySelector} className="p-2 hover:bg-gray-800 rounded-full" disabled={isLoadingAny}><span className="text-2xl">🔑</span></button>
            
          </div>
        </div>
      </header>

      <ArchiveLocker isOpen={isLockerOpen} onClose={() => setIsLockerOpen(false)} comics={archive} onSelect={selectArchivedComic} />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {!hasInvestigationStarted ? (
          <LandingPage onStartInvestigation={handleStartInvestigation} mode={mode} />
        ) : (
          <>
            {error && !isLoadingAny && (
              <div className="p-8 bg-red-100 border-4 border-red-600 text-red-700 font-bold max-w-2xl mx-auto mt-12 text-center shadow-lg">
                <h3 className="text-2xl font-comic uppercase mb-2">
                  {error.isQuota ? UI_TEXT.ERRORS.QUOTA_TITLE : (error.isBusy ? UI_TEXT.ERRORS.BUSY_TITLE : UI_TEXT.ERRORS.GENERAL_TITLE)}
                </h3>
                <p className="mb-4">{error.message}</p>
                <button onClick={() => setError(null)} className="px-6 py-2 bg-red-600 text-white font-bold comic-border">{UI_TEXT.BUTTONS.RETRY}</button>
              </div>
            )}

            {isLoadingAny && (currentLoadingPhase === 'INITIAL' || currentLoadingPhase === 'COMIC_GENERATION') && (
              <LoadingState phase={currentLoadingPhase} />
            )}

            {!comic && selectedReport && !isGeneratingComic && ( 
              <ReportViewer
                mode={mode}
                selectedReport={selectedReport}
                onGenerateRandomReport={handleGenerateRandomReport}
                onGenerateComicFromReport={generateComicStrip}
                isGeneratingComic={isGeneratingComic}
                error={error}
                currentLoadingPhase={currentLoadingPhase}
              />
            )}
            
            {!comic && !selectedReport && !isLoadingAny && allHardcodedReports.length === 0 && (
              // Fallback if there are NO hardcoded reports at all after initialization
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white comic-border mt-12 relative overflow-hidden">
                <div className="text-8xl mb-6">🕵️‍♀️</div>
                <h2 className="text-4xl font-comic uppercase mb-4 italic">No Reports Found!</h2>
                <p className="max-w-xl text-gray-700 font-bold mb-8">
                  It seems there are no disciplinary reports in our archives. This is unexpected.
                </p>
              </div>
            )}
          </>
        )}

        {comic && (
          <div key={comic.timestamp || 'current'} className="space-y-8 animate-swipe mt-8">
            <div className={`comic-border p-6 flex flex-col md:flex-row gap-6 items-start ${mode === 'superhero' ? 'bg-red-50' : 'bg-white'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-10 w-2 ${mode === 'superhero' ? 'bg-yellow-500' : 'bg-red-600'}`}></div>
                  <h2 className="text-4xl font-comic text-black uppercase italic">{comic.title}</h2>
                </div>
                
                {comic.timestamp && archive.some(a => a.timestamp === comic.timestamp) && (
                  <div className="mb-2">
                    <span className="text-[9px] font-bold bg-green-600 text-white px-2 py-0.5 uppercase tracking-widest comic-border border-[1px]">{UI_TEXT.CASE_HEADER.ARCHIVED_BADGE}</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <p className="text-sm font-bold text-gray-400 uppercase">{mode === 'gritty' ? UI_TEXT.CASE_HEADER.GRITTY : UI_TEXT.CASE_HEADER.SUPERHERO}</p>
                  {comic.sourceUrl && (
                    <a href={comic.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase hover:bg-red-600">
                      {UI_TEXT.CASE_HEADER.SOURCE_LINK}
                    </a>
                  )}
                </div>
                <p className="text-gray-800 font-body border-l-4 border-black pl-4 py-2 bg-gray-50 italic">{comic.originalSummary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comic.panels.map((panel, idx) => (
                <ComicPanel key={`${comic.timestamp}-${panel.id}`} panel={panel} index={idx} />
              ))}
            </div>

            {!isGeneratingComic && (
              <div className="flex justify-center py-12 gap-6">
                <button onClick={() => setIsLockerOpen(true)} className="px-8 py-5 bg-white text-black font-comic text-2xl uppercase hover:bg-gray-100 comic-border">Archive</button>
                <button 
                  onClick={handleGenerateRandomReport} // Now calls the new random report function
                  disabled={isLoadingAny} 
                  className="group flex items-center gap-4 px-10 py-5 bg-black text-white font-comic text-2xl uppercase hover:bg-gray-900 comic-border"
                >
                  <span>{UI_TEXT.BUTTONS.NEXT_CASE}</span>
                  <span className="group-hover:translate-x-2 transition-transform text-red-500">{mode === 'superhero' ? '🦸‍♂️' : '⚖️'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;