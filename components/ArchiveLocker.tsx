
import React from 'react';
import { ComicStrip } from '../types';
import { UI_TEXT } from '../constants/content';

interface ArchiveLockerProps {
  isOpen: boolean;
  onClose: () => void;
  comics: ComicStrip[];
  onSelect: (comic: ComicStrip) => void;
}

const ArchiveLocker: React.FC<ArchiveLockerProps> = ({ isOpen, onClose, comics, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fdf6e3] h-full shadow-2xl border-l-8 border-black flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b-4 border-black bg-black text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-comic uppercase leading-none">{UI_TEXT.LOCKER.TITLE}</h2>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{UI_TEXT.LOCKER.SUBTITLE}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-500 font-comic text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {comics.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <span className="text-6xl mb-4">🗄️</span>
              <p className="font-bold uppercase text-xs">{UI_TEXT.LOCKER.EMPTY}</p>
            </div>
          ) : (
            comics.map((comic, idx) => (
              <div 
                key={comic.timestamp || idx}
                onClick={() => {
                  onSelect(comic);
                  onClose();
                }}
                className="group cursor-pointer bg-white comic-border p-3 hover:scale-[1.02] transition-transform relative overflow-hidden"
              >
                <div className="flex gap-4">
                  {/* Thumbnail (Panel 1) */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-200 border-2 border-black overflow-hidden">
                    {comic.panels[0]?.imageUrl ? (
                      <img 
                        src={comic.panels[0].imageUrl} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        alt="Thumb"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📁</div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-comic text-black truncate uppercase">{comic.title}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 italic font-bold">
                      {comic.originalSummary}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 font-bold uppercase">
                          Closed Case
                       </span>
                    </div>
                  </div>
                </div>

                {/* Decorative "CLOSED" Stamp */}
                <div className="absolute -top-2 -right-4 rotate-12 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity">
                  <span className="text-4xl font-comic text-red-600 border-4 border-red-600 p-1">
                    {UI_TEXT.LOCKER.STAMP}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-black/5 text-center">
           <button 
             onClick={onClose}
             className="w-full py-3 bg-black text-white font-comic text-xl uppercase hover:bg-gray-800"
           >
             {UI_TEXT.LOCKER.CLOSE}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveLocker;
