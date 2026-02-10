import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Accessing the Metro Justice Database...",
  "Intercepting encrypted Guardian reports...",
  "Calibrating neural-link visuals...",
  "Analyzing incident coordinates...",
  "Synthesizing high-def superhero renderings...",
  "Updating the Discipline Files...",
  "Applying comic-ink filters..."
];

const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000); // 4 seconds interval to allow typewriter effect to finish
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 bg-white comic-border max-w-2xl mx-auto my-12">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-black border-t-red-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">⚡</span>
        </div>
      </div>
      <div className="text-center space-y-2 min-h-[100px] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-comic uppercase text-black italic">Activating Justice Protocols</h2>
        {/* Re-mount component on index change to restart typewriter animation */}
        <div key={msgIndex} className="inline-block overflow-hidden max-w-full">
          <p className="text-lg font-bold text-gray-600 typewriter-text border-none">
            {MESSAGES[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;