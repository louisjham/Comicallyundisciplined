
import React, { useState, useCallback, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import { ComicStrip, AppMode } from './types';
import { UI_TEXT } from './constants/content';
import ComicPanel from './components/ComicPanel';
import LoadingState from './components/LoadingState';
import ArchiveLocker from './components/ArchiveLocker';

const App: React.FC = () => {
  const [comic, setComic] = useState<ComicStrip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>('gritty');
  const [error, setError] = useState<{ message: string; isQuota?: boolean } | null>(null);
  
  // Archive State
  const [archive, setArchive] = useState<ComicStrip[]>([]);
  const [isLockerOpen, setIsLockerOpen] = useState<boolean>(false);

  // Load Archive on Mount
  useEffect(() => {
    const loadArchive = async () => {
      const savedComics = await storageService.getAllComics();
      setArchive(savedComics);
    };
    loadArchive();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      if (error?.isQuota) generateComic();
    }
  };

  const generateComic = useCallback(async () => {
    setLoading(true);
    setError(null);
    setComic(null);

    try {
      const report = await geminiService.fetchRandomReport();
      const script = await geminiService.generateComicScript(report, mode);
      
      // Update with just the script first
      setComic({ ...script, panels: script.panels.map(p => ({ ...p, imageUrl: undefined })) });

      // Generate all images
      const imagePromises = script.panels.map(async (panel) => {
        const imageUrl = await geminiService.generatePanelImage(panel.visualPrompt, mode);
        return { id: panel.id, imageUrl };
      });

      const images = await Promise.all(imagePromises);

      const finalComic: ComicStrip = {
        ...script,
        panels: script.panels.map(p => {
          const img = images.find(i => i.id === p.id);
          return img ? { ...p, imageUrl: img.imageUrl } : p;
        }),
        timestamp: Date.now()
      };

      setComic(finalComic);
      
      // Save to Archive
      await storageService.saveComic(finalComic);
      const updatedArchive = await storageService.getAllComics();
      setArchive(updatedArchive);

    } catch (err: any) {
      console.error(err);
      const isQuota = err.message?.includes('429') || err.message?.toLowerCase().includes('limit');
      setError({ 
        message: isQuota ? UI_TEXT.ERRORS.QUOTA_SUB : (err.message || "An unexpected error occurred."),
        isQuota
      });
    } finally {
      setLoading(false);
    }
  }, [error, mode]);

  const selectArchivedComic = (selected: ComicStrip) => {
    setComic(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-500 ${mode === 'superhero' ? 'bg-yellow-50' : 'bg-gray-100'}`}>
      <header className="bg-black text-white p-6 shadow-xl border-b-4 border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-comic uppercase italic tracking-tighter leading-none">{UI_TEXT.TITLE}</h1>
            <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase mt-1">{UI_TEXT.SUBTITLE}</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Mode Toggle */}
            <div className="flex bg-gray-800 p-1 comic-border border-white border-2">
              <button 
                onClick={() => setMode('gritty')}
                className={`px-4 py-1 text-xs font-bold uppercase transition-all ${mode === 'gritty' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Gritty Noir
              </button>
              <button 
                onClick={() => setMode('superhero')}
                className={`px-4 py-1 text-xs font-bold uppercase transition-all ${mode === 'superhero' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Heroic Fail
              </button>
            </div>

            {/* Archive Locker Trigger */}
            <button 
              onClick={() => setIsLockerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-white hover:bg-gray-800 transition-colors group relative"
            >
              <span className="text-xl">🗄️</span>
              <span className="text-[10px] font-bold uppercase hidden md:inline">{UI_TEXT.BUTTONS.VIEW_LOCKER}</span>
              {archive.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white font-bold">
                  {archive.length}
                </span>
              )}
            </button>

             <button onClick={handleOpenKeySelector} className="p-2 hover:bg-gray-800 rounded-full group relative">
              <span className="text-2xl">🔑</span>
            </button>
            
            <button 
              onClick={generateComic}
              disabled={loading}
              className={`px-8 py-3 font-comic text-xl uppercase tracking-wider transition-all
                ${loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white active:translate-y-1 comic-border border-white'
                }`}
            >
              {loading ? UI_TEXT.BUTTONS.LOADING : UI_TEXT.BUTTONS.NEW_CASE}
            </button>
          </div>
        </div>
      </header>

      <ArchiveLocker 
        isOpen={isLockerOpen} 
        onClose={() => setIsLockerOpen(false)} 
        comics={archive}
        onSelect={selectArchivedComic}
      />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {!comic && !loading && !error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white comic-border mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">⚖️</div>
            <div className="text-8xl mb-6">{mode === 'gritty' ? '📁' : '🦸‍♂️'}</div>
            <h2 className="text-4xl font-comic uppercase mb-4 italic text-black">
              {mode === 'gritty' ? UI_TEXT.LANDING.GRITTY.TITLE : UI_TEXT.LANDING.SUPERHERO.TITLE}
            </h2>
            <div className="max-w-xl text-gray-700 font-bold mb-8 space-y-4">
              <p>
                {mode === 'gritty' ? UI_TEXT.LANDING.GRITTY.DESCRIPTION : UI_TEXT.LANDING.SUPERHERO.DESCRIPTION}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={generateComic}
                className="px-12 py-4 bg-red-600 text-white font-comic text-2xl uppercase hover:bg-red-700 transition-colors comic-border border-white"
              >
                {UI_TEXT.LANDING.BUTTON}
              </button>
              {archive.length > 0 && (
                 <button 
                  onClick={() => setIsLockerOpen(true)}
                  className="px-8 py-4 bg-black text-white font-comic text-2xl uppercase hover:bg-gray-900 transition-colors comic-border border-white"
                >
                  History
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 bg-red-100 border-4 border-red-600 text-red-700 font-bold max-w-2xl mx-auto mt-12 text-center shadow-lg">
            <h3 className="text-2xl font-comic uppercase mb-2">
              {error.isQuota ? UI_TEXT.ERRORS.QUOTA_TITLE : UI_TEXT.ERRORS.GENERAL_TITLE}
            </h3>
            <p className="mb-4">{error.message}</p>
            
            <button onClick={generateComic} className="px-6 py-2 bg-red-600 text-white font-bold comic-border">
              {UI_TEXT.BUTTONS.RETRY}
            </button>
          </div>
        )}

        {loading && !comic && <LoadingState />}

        {comic && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className={`comic-border p-6 flex flex-col md:flex-row gap-6 items-start ${mode === 'superhero' ? 'bg-red-50' : 'bg-white'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-10 w-2 ${mode === 'superhero' ? 'bg-yellow-500' : 'bg-red-600'}`}></div>
                  <h2 className="text-4xl font-comic text-black uppercase italic">{comic.title}</h2>
                </div>
                
                {/* Archived Badge */}
                {comic.timestamp && archive.some(a => a.timestamp === comic.timestamp) && (
                   <div className="mb-2">
                     <span className="text-[9px] font-bold bg-green-600 text-white px-2 py-0.5 uppercase tracking-widest comic-border border-[1px]">
                       {UI_TEXT.CASE_HEADER.ARCHIVED_BADGE}
                     </span>
                   </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <p className="text-sm font-bold text-gray-400 uppercase">
                    {mode === 'gritty' ? UI_TEXT.CASE_HEADER.GRITTY : UI_TEXT.CASE_HEADER.SUPERHERO}
                  </p>
                  {comic.sourceUrl && (
                    <a href={comic.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase hover:bg-red-600 transition-colors inline-block w-fit">
                      {UI_TEXT.CASE_HEADER.SOURCE_LINK}
                    </a>
                  )}
                </div>
                <p className="text-gray-800 font-body leading-relaxed border-l-4 border-black pl-4 py-2 bg-gray-50 italic">
                  {comic.originalSummary}
                </p>
              </div>
              <div className={`w-full md:w-64 flex flex-col items-center justify-center p-4 border-2 ${mode === 'superhero' ? 'bg-yellow-400 text-black border-black' : 'bg-gray-900 text-white border-red-600'}`}>
                 <span className="text-4xl mb-2">{mode === 'superhero' ? '💥' : '🏛️'}</span>
                 <p className="text-[10px] font-bold text-center uppercase tracking-tighter">
                    {mode === 'superhero' ? UI_TEXT.CASE_HEADER.STAMP_SUPERHERO : UI_TEXT.CASE_HEADER.STAMP_GRITTY}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comic.panels.map((panel, idx) => (
                <ComicPanel key={panel.id || idx} panel={panel} index={idx} />
              ))}
            </div>

            <div className="flex justify-center py-12 gap-6">
               <button 
                onClick={() => setIsLockerOpen(true)}
                className="px-8 py-5 bg-white text-black font-comic text-2xl uppercase hover:bg-gray-100 transition-all comic-border"
              >
                Archive
              </button>
              <button 
                onClick={generateComic}
                disabled={loading}
                className="group flex items-center gap-4 px-10 py-5 bg-black text-white font-comic text-2xl uppercase hover:bg-gray-900 transition-all comic-border"
              >
                <span>{UI_TEXT.BUTTONS.NEXT_CASE}</span>
                <span className="group-hover:translate-x-2 transition-transform text-red-500">{mode === 'superhero' ? '🦸‍♂️' : '⚖️'}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
