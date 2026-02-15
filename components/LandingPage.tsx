import React from 'react';
import { UI_TEXT } from '../constants/content';

interface LandingPageProps {
  onStartInvestigation: () => void;
  mode: 'gritty' | 'superhero';
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartInvestigation, mode }) => {
  const isGritty = mode === 'gritty';

  return (
    <div className={`comic-border p-6 mt-8 max-w-4xl mx-auto ${isGritty ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900'}`}>
      <h2 className={`text-4xl font-comic uppercase mb-6 text-center ${isGritty ? 'text-red-500' : 'text-blue-700'}`}>
        {UI_TEXT.LANDING_PAGE.TITLE}
      </h2>
      <p className={`font-body text-center text-lg italic mb-6 ${isGritty ? 'text-gray-300' : 'text-gray-700'}`}>
        "{UI_TEXT.LANDING_PAGE.CATCHPHRASE}"
      </p>

      <div className={`comic-border p-5 mb-8 ${isGritty ? 'bg-black text-gray-100 border-red-600' : 'bg-white text-gray-800 border-blue-700'}`}>
        <h3 className={`text-2xl font-comic uppercase mb-3 ${isGritty ? 'text-red-400' : 'text-blue-600'}`}>
          {UI_TEXT.LANDING_PAGE.ABOUT_REPORTS_HEADER}
        </h3>
        <p className="font-body text-sm mb-4">
          {UI_TEXT.LANDING_PAGE.ABOUT_REPORTS_CONTENT_P1}
        </p>
        <p className="font-body text-sm mb-4">
          {UI_TEXT.LANDING_PAGE.ABOUT_REPORTS_CONTENT_P2}
        </p>
        <p className="font-body text-sm">
          {UI_TEXT.LANDING_PAGE.ABOUT_REPORTS_CONTENT_P3}
        </p>
      </div>

      <div className={`comic-border p-5 mb-8 ${isGritty ? 'bg-black text-gray-100 border-yellow-400' : 'bg-white text-gray-800 border-green-700'}`}>
        <h3 className={`text-2xl font-comic uppercase mb-3 ${isGritty ? 'text-yellow-400' : 'text-green-700'}`}>
          {UI_TEXT.LANDING_PAGE.HOW_IT_WORKS_HEADER}
        </h3>
        <p className="font-body text-sm mb-4">
          {UI_TEXT.LANDING_PAGE.HOW_IT_WORKS_CONTENT_P1}
        </p>
        <p className="font-body text-sm">
          {UI_TEXT.LANDING_PAGE.HOW_IT_WORKS_CONTENT_P2}
        </p>
      </div>

      <div className={`comic-border p-5 mb-8 ${isGritty ? 'bg-black text-gray-100 border-gray-500' : 'bg-white text-gray-800 border-gray-500'}`}>
        <h3 className={`text-2xl font-comic uppercase mb-3 ${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>
          {UI_TEXT.LANDING_PAGE.DISCLAIMER_HEADER}
        </h3>
        <p className="font-body text-sm italic mb-4">
          {UI_TEXT.LANDING_PAGE.DISCLAIMER_CONTENT_P1}
        </p>
        <p className="font-body text-sm italic mb-4">
          {UI_TEXT.LANDING_PAGE.DISCLAIMER_CONTENT_P2}
        </p>
        <p className="font-body text-sm italic">
          {UI_TEXT.LANDING_PAGE.DISCLAIMER_CONTENT_P3}
        </p>
      </div>

      <button
        onClick={onStartInvestigation}
        className={`w-full px-8 py-5 font-comic text-2xl uppercase tracking-wider 
                    ${isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} 
                    text-white comic-border border-white animate-comic-glow`}
      >
        {UI_TEXT.BUTTONS.START_INVESTIGATION}
      </button>
    </div>
  );
};

export default LandingPage;