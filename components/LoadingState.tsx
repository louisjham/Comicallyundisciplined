
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants/content';

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 bg-white comic-border max-w-2xl mx-auto my-12">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-black border-t-red-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">⚖️</span>
        </div>
      </div>
      <div className="text-center space-y-2 min-h-[100px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-comic uppercase text-black tracking-widest">Archive Investigation in Progress</h2>
        <div key={msgIndex} className="inline-block overflow-hidden max-w-full">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">
            {LOADING_MESSAGES[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
