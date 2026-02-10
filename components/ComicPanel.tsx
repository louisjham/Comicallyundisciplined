import React from 'react';
import { ComicPanel as PanelType } from '../types';

interface ComicPanelProps {
  panel: PanelType;
  index: number;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ panel, index }) => {
  return (
    <div className="relative group overflow-hidden bg-white comic-border h-full flex flex-col">
      {/* Narration box - High contrast black text on bright yellow */}
      <div className="bg-[#FFD700] border-b-4 border-black p-4 text-sm font-bold uppercase z-10 font-body min-h-[4.5rem] flex items-center justify-center text-center text-black">
        <span className="leading-tight drop-shadow-sm">{panel.narration}</span>
      </div>

      {/* Image Area */}
      <div className="flex-1 relative bg-gray-200 aspect-square overflow-hidden flex items-center justify-center border-b-2 border-black">
        {panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={`Panel ${index + 1}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#f8fafc] relative">
            {/* Ben-Day Dots Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#000 1.5px, transparent 0)',
                backgroundSize: '12px 12px'
              }}
            ></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>✍️</span>
              </div>
              
              <div className="relative animate-comic-glow">
                <div className="bg-black text-white px-6 py-2 font-comic text-xl uppercase italic -skew-x-12 border-2 border-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] tracking-widest flex items-center justify-center overflow-hidden">
                  <span className="typewriter-text">Inking Frame...</span>
                </div>
                {/* Comic decoration lines */}
                <div className="absolute -top-4 -right-4 text-red-600 text-2xl font-comic opacity-50">!!</div>
                <div className="absolute -bottom-4 -left-4 text-red-600 text-2xl font-comic opacity-50">??</div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {/* Speech Bubble */}
        {panel.speechBubble && panel.imageUrl && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white border-4 border-black p-3 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-bold italic z-20 text-black text-center">
             "{panel.speechBubble}"
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-black rotate-45"></div>
          </div>
        )}
      </div>
      
      {/* Panel Number Indicator */}
      <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 text-[12px] font-comic z-20 border-2 border-white">
        CASE PANEL {index + 1}
      </div>
    </div>
  );
};

export default ComicPanel;