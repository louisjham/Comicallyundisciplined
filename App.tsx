import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from './services/geminiService';
import { ComicStrip } from './types';
import ComicPanel from './components/ComicPanel';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [comic, setComic] = useState<ComicStrip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateComic = useCallback(async () => {
    setLoading(true);
    setError(null);
    setComic(null);

    try {
      const report = await geminiService.fetchRandomReport();
      const script = await geminiService.generateComicScript(report);
      
      setComic({ ...script, panels: script.panels.map(p => ({ ...p, imageUrl: undefined })) });

      const imagePromises = script.panels.map(async (panel) => {
        const imageUrl = await geminiService.generatePanelImage(panel.visualPrompt);
        return { id: panel.id, imageUrl };
      });

      const images = await Promise.all(imagePromises);

      setComic(prev => {
        if (!prev) return null;
        return {
          ...prev,
          panels: prev.panels.map(p => {
            const img = images.find(i => i.id === p.id);
            return img ? { ...p, imageUrl: img.imageUrl } : p;
          })
        };
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-black text-white p-6 shadow-xl border-b-4 border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-comic uppercase italic tracking-tighter">Comically unDisciplined</h1>
            <p className="text-red-500 font-bold text-sm tracking-[0.2em] uppercase">Austin PD Oversight Chronicles</p>
          </div>
          <button 
            onClick={generateComic}
            disabled={loading}
            className={`px-8 py-3 rounded-none font-comic text-xl uppercase tracking-wider transition-all
              ${loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-500 text-white active:translate-y-1 comic-border border-white'
              }`}
          >
            {loading ? 'Initializing...' : 'Intercept New File'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {!comic && !loading && !error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white comic-border mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">💥</div>
            <div className="text-8xl mb-6">🏙️</div>
            <h2 className="text-4xl font-comic uppercase mb-4 italic text-black">Citizen's Review Protocol</h2>
            <div className="max-w-xl text-gray-700 font-bold mb-8 space-y-4">
              <p>
                This application scours official City of Austin archives to locate real disciplinary action reports from the Austin Police Department.
              </p>
              <p className="bg-red-50 p-4 border-l-4 border-red-600 italic">
                Using Gemini's reasoning, we transform bureaucratic documents into 4-panel urban superhero comic strips, visualizing the thin line between duty and discipline in Metro City.
              </p>
            </div>
            <button 
              onClick={generateComic}
              className="px-12 py-4 bg-red-600 text-white font-comic text-2xl uppercase hover:bg-red-700 transition-colors comic-border border-white"
            >
              Scan Official Data-Stream
            </button>
          </div>
        )}

        {error && (
          <div className="p-8 bg-red-100 border-4 border-red-600 text-red-700 font-bold max-w-2xl mx-auto mt-12 text-center shadow-lg">
            <h3 className="text-2xl font-comic uppercase mb-2">Comms Failure!</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={generateComic}
              className="px-6 py-2 bg-red-600 text-white font-bold hover:bg-red-700 comic-border"
            >
              Reboot Search
            </button>
          </div>
        )}

        {loading && !comic && <LoadingState />}

        {comic && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Strip Intro */}
            <div className="bg-white comic-border p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-2 bg-red-600"></div>
                  <h2 className="text-4xl font-comic text-black uppercase italic">{comic.title}</h2>
                </div>
                <p className="text-xs font-bold text-red-600 uppercase mb-4 tracking-widest">Public Safety Directive #92-A</p>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <p className="text-sm font-bold text-gray-400 uppercase">Internal Affairs Briefing</p>
                  {comic.sourceUrl && (
                    <a 
                      href={comic.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase hover:bg-red-600 transition-colors inline-block w-fit"
                    >
                      View Original Document ↗
                    </a>
                  )}
                </div>
                <p className="text-gray-800 font-body leading-relaxed border-l-4 border-black pl-4 py-2 bg-gray-50 italic">
                  {comic.originalSummary}
                </p>
              </div>
              <div className="w-full md:w-64 flex flex-col items-center justify-center p-4 bg-gray-900 text-white border-2 border-red-600">
                 <span className="text-4xl mb-2 text-red-500">📁</span>
                 <p className="text-[10px] font-bold text-center uppercase tracking-tighter">
                    Official Metro Justice Intelligence File
                 </p>
              </div>
            </div>

            {/* The Comic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comic.panels.map((panel, idx) => (
                <ComicPanel key={panel.id || idx} panel={panel} index={idx} />
              ))}
            </div>

            {/* Footer Action */}
            <div className="flex justify-center py-12">
              <button 
                onClick={generateComic}
                disabled={loading}
                className="group flex items-center gap-4 px-10 py-5 bg-black text-white font-comic text-2xl uppercase hover:bg-gray-900 transition-all comic-border"
              >
                <span>Process Next Incident</span>
                <span className="group-hover:translate-x-2 transition-transform text-red-500">⚡</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Call-to-Action for Mobile */}
      {comic && !loading && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={generateComic}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-black active:scale-95"
          >
            <span className="text-2xl text-white">💥</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;