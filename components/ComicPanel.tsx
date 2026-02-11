
import React from 'react';
import { ComicPanel as PanelType } from '../types';

interface ComicPanelProps {
  panel: PanelType;
  index: number;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ panel, index }) => {
  return (
    <div className="relative group overflow-hidden bg-white comic-border h-full flex flex-col">
      {/* Narration box - Documentary style: White background, bold typewriter-ish feel */}
      <div className="bg-white border-b-4 border-black p-4 text-xs font-bold uppercase z-10 font-body min-h-[5rem] flex items-center justify-center text-center text-black">
        <span className="leading-tight border-l-4 border-red-600 pl-3 py-1 bg-gray-50">{panel.narration}</span>
      </div>

      {/* Image Area */}
      <div className="flex-1 relative bg-gray-100 aspect-square overflow-hidden flex items-center justify-center border-b-2 border-black">
        {panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={`Panel ${index + 1}`} 
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#f8fafc] relative">
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#000 1.5px, transparent 0)',
                backgroundSize: '16px 16px'
              }}
            ></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-5xl mb-4">🔦</div>
              <div className="bg-black text-white px-6 py-2 font-comic text-xl uppercase italic -skew-x-2 border-2 border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] tracking-widest">
                Searching Files...
              </div>
            </div>
          </div>
        )}

        {/* Speech Bubble - More standard graphic novel style */}
        {panel.speechBubble && panel.imageUrl && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white border-2 border-black p-3 rounded-lg shadow-lg text-[10px] font-bold italic z-20 text-black text-center uppercase leading-tight">
             "{panel.speechBubble}"
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
          </div>
        )}
      </div>
      
      {/* Panel Label */}
      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold z-20 border-2 border-black uppercase tracking-tighter">
        Exhibt {index + 1}
      </div>
    </div>
  );
};

export default ComicPanel;
