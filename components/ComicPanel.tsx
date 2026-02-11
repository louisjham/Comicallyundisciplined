
import React from 'react';
import { ComicPanel as PanelType } from '../types';

interface ComicPanelProps {
  panel: PanelType;
  index: number;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ panel, index }) => {
  return (
    <div className="relative group overflow-hidden bg-white comic-border h-full flex flex-col">
      {/* Narration box */}
      <div className="bg-white border-b-4 border-black p-4 text-xs font-bold uppercase z-10 font-body min-h-[5rem] flex items-center justify-center text-center text-black">
        <span className="leading-tight border-l-4 border-red-600 pl-3 py-1 bg-gray-50">{panel.narration}</span>
      </div>

      {/* Image Area */}
      <div className="flex-1 relative bg-gray-100 aspect-square overflow-hidden flex items-center justify-center border-b-2 border-black">
        {panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={`Panel ${index + 1}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#f8fafc] relative">
            {/* Grid Pattern Background */}
            <div 
              className="absolute inset-0 opacity-[0.15] pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}
            ></div>
            
            {/* Dynamic Sketching Animation */}
            <div className="relative z-10 flex flex-col items-center text-center p-6">
              <div className="relative mb-6">
                <div className="text-6xl animate-bounce transform -rotate-12">✍️</div>
                <div className="absolute -bottom-2 -right-2 text-4xl animate-pulse">✨</div>
                
                {/* Visual "Scribble" lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-dashed border-red-400 rounded-full animate-spin-slow opacity-20"></div>
              </div>

              <div className="animate-comic-glow bg-black text-white px-6 py-2 font-comic text-xl uppercase italic border-2 border-white shadow-[4px_4px_0_0_rgba(220,38,38,1)] tracking-widest transform -rotate-2">
                Drafting Exhibit {index + 1}...
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                  Applying Satirical Ink Layers
                </p>
                <div className="flex gap-1 justify-center">
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>

            {/* Inky corner decorations */}
            <div className="absolute top-0 right-0 p-2 text-black opacity-5 text-4xl">✒️</div>
            <div className="absolute bottom-0 left-0 p-2 text-black opacity-5 text-4xl">🖌️</div>
          </div>
        )}

        {/* Speech Bubble */}
        {panel.speechBubble && panel.imageUrl && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white border-2 border-black p-3 rounded-lg shadow-lg text-[10px] font-bold italic z-20 text-black text-center uppercase leading-tight">
             "{panel.speechBubble}"
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
          </div>
        )}
      </div>
      
      {/* Panel Label */}
      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold z-20 border-2 border-black uppercase tracking-tighter shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        Case Part {index + 1}
      </div>
    </div>
  );
};

export default ComicPanel;
