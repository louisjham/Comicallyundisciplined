import React from 'react';
import { AppMode, ReportSummary } from '../types';
import { UI_TEXT } from '../constants/content';
import { LoadingPhase } from './LoadingState';

interface ReportViewerProps {
  mode: AppMode;
  selectedReport: ReportSummary | null;
  onGenerateRandomReport: () => void;
  onGenerateComicFromReport: (report: ReportSummary) => Promise<void>;
  isGeneratingComic: boolean;
  error: { message: string; isQuota?: boolean; isBusy?: boolean } | null;
  currentLoadingPhase: LoadingPhase | null;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  mode,
  selectedReport,
  onGenerateRandomReport,
  onGenerateComicFromReport,
  isGeneratingComic,
  error,
  currentLoadingPhase
}) => {
  const isGritty = mode === 'gritty';
  const isLoadingAny = isGeneratingComic; // Only comic generation is a loading state now

  if (!selectedReport) {
    // This state should ideally not be reached if initial report is loaded on app start
    // but acts as a fallback or if user somehow clears the selected report.
    return (
      <div className={`comic-border p-6 mt-8 ${isGritty ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900'}`}>
        <h3 className={`text-2xl font-comic uppercase mb-4 ${isGritty ? 'text-red-500' : 'text-blue-700'}`}>
          {isGritty ? UI_TEXT.REPORT_LIST.GRITTY_TITLE : UI_TEXT.REPORT_LIST.SUPERHERO_TITLE}
        </h3>
        <p className={`text-center py-8 text-lg italic ${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>
          {UI_TEXT.REPORT_LIST.NO_REPORTS_AVAILABLE}
        </p>
        <button
            onClick={onGenerateRandomReport}
            disabled={isLoadingAny}
            className={`w-full px-6 py-3 font-comic text-lg uppercase tracking-wider ${isLoadingAny ? 'bg-gray-600' : (isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500')} text-white comic-border border-white`}
          >
            {UI_TEXT.BUTTONS.GENERATE_RANDOM_REPORT}
          </button>
      </div>
    );
  }

  // Render details of selected report
  return (
    <div className={`comic-border p-6 mt-8 ${isGritty ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900'}`}>
      <h3 className={`text-2xl font-comic uppercase mb-4 ${isGritty ? 'text-red-500' : 'text-blue-700'}`}>
        {UI_TEXT.SELECTED_REPORT_VIEW.TITLE}
      </h3>

      <div className={`comic-border p-4 mt-6 ${isGritty ? 'bg-black text-white border-red-600' : 'bg-white text-gray-900 border-blue-700'}`}>
        <div className="space-y-2 text-sm font-body">
          <p><strong className={`${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_OFFICER}:</strong> {selectedReport.officerName}</p>
          <p><strong className={`${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_DATE}:</strong> {selectedReport.incidentDate}</p>
          <p><strong className={`${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_ALLEGATION}:</strong> {selectedReport.allegation}</p>
          <p><strong className={`${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_OUTCOME}:</strong> {selectedReport.outcome}</p>
          <div className={`border-l-4 ${isGritty ? 'border-red-600' : 'border-blue-700'} pl-3 py-1 mt-3`}>
            <strong className={`${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_SUMMARY}:</strong>
            <p className="mt-1 italic">{selectedReport.originalText}</p>
          </div>
          {selectedReport.sourceUrl && (
            <a href={selectedReport.sourceUrl} target="_blank" rel="noopener noreferrer" 
               className={`text-[10px] ${isGritty ? 'bg-red-600' : 'bg-blue-600'} text-white px-2 py-0.5 font-bold uppercase hover:opacity-80 inline-block mt-3`}>
              {UI_TEXT.CASE_HEADER.SOURCE_LINK}
            </a>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-700 gap-4">
          <button
            onClick={() => onGenerateComicFromReport(selectedReport)}
            disabled={isGeneratingComic}
            className={`px-6 py-3 font-comic text-lg uppercase tracking-wider 
                        ${isGeneratingComic ? 'bg-gray-600 cursor-not-allowed' : (isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500')} 
                        text-white comic-border border-white w-full md:w-auto`}
          >
            {isGeneratingComic ? 'Generating Comic...' : UI_TEXT.SELECTED_REPORT_VIEW.GENERATE_COMIC_BUTTON}
          </button>
          <button
            onClick={onGenerateRandomReport}
            disabled={isLoadingAny}
            className={`px-4 py-2 font-comic text-sm uppercase ${isGritty ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-300'} text-white comic-border border-white w-full md:w-auto`}
          >
            {UI_TEXT.BUTTONS.NEXT_CASE}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;