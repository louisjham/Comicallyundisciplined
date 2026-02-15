
import React from 'react';
import { AppMode, ReportSummary } from '../types';
import { UI_TEXT } from '../constants/content';
import { LoadingPhase } from './LoadingState';

interface ReportListAndDetailProps {
  mode: AppMode;
  availableReports: ReportSummary[] | null;
  selectedReport: ReportSummary | null;
  onSelectReport: (report: ReportSummary) => void;
  onBackToList: () => void;
  onFetchNewReportList: () => Promise<void>; // Still keeps this as a "reset to library list"
  onGenerateComicFromReport: (report: ReportSummary) => Promise<void>;
  // Removed isFetchingReportList: boolean;
  // Removed isFetchingReportDetails: boolean;
  isGeneratingComic: boolean;
  error: { message: string; isQuota?: boolean; isBusy?: boolean } | null;
  currentLoadingPhase: LoadingPhase | null;
}

const ReportListAndDetail: React.FC<ReportListAndDetailProps> = ({
  mode,
  availableReports,
  selectedReport,
  onSelectReport,
  onBackToList,
  onFetchNewReportList,
  onGenerateComicFromReport,
  // Removed isFetchingReportList, isFetchingReportDetails,
  isGeneratingComic,
  error,
  currentLoadingPhase
}) => {
  const isGritty = mode === 'gritty';
  const isLoadingAny = isGeneratingComic; // Only comic generation is a loading state now

  // Render list of reports
  if (!selectedReport) {
    return (
      <div className={`comic-border p-6 mt-8 ${isGritty ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900'}`}>
        <h3 className={`text-2xl font-comic uppercase mb-4 ${isGritty ? 'text-red-500' : 'text-blue-700'}`}>
          {isGritty ? UI_TEXT.REPORT_LIST.GRITTY_TITLE : UI_TEXT.REPORT_LIST.SUPERHERO_TITLE}
        </h3>

        <div className="mb-6">
          <button
            onClick={onFetchNewReportList}
            disabled={isLoadingAny}
            className={`w-full px-6 py-3 font-comic text-lg uppercase tracking-wider ${isLoadingAny ? 'bg-gray-600' : (isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500')} text-white comic-border border-white`}
          >
            {UI_TEXT.REPORT_LIST.FETCH_LIST_BUTTON}
          </button>
        </div>

        {error && ( // Keep error display for general errors, not specific fetch errors
          <div className="p-4 bg-red-700 text-white font-bold mb-4 text-center comic-border">
            <p>{error.message}</p>
          </div>
        )}

        {availableReports && availableReports.length > 0 ? (
          <>
            <p className={`text-sm mb-4 font-bold ${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>
              {UI_TEXT.REPORT_LIST.REPORTS_COUNT(availableReports.length)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableReports.map((report, index) => (
                <div 
                  key={report.sourceUrl || index} // Key by sourceUrl which is unique
                  className={`comic-border p-4 ${isGritty ? 'bg-black text-white border-gray-700' : 'bg-white text-gray-900 border-blue-200'} flex flex-col justify-between`}
                >
                  <div>
                    {/* Reports are now always fully detailed */}
                    <>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-1">{UI_TEXT.SELECTED_REPORT_VIEW.DETAILS_OFFICER}:</p>
                      <h4 className={`text-lg font-comic uppercase ${isGritty ? 'text-red-500' : 'text-blue-700'} mb-2`}>{report.officerName}</h4>
                      <p className="text-xs italic font-body text-gray-400 mb-2">{report.incidentDate} - {report.outcome}</p>
                      <p className={`text-sm font-body line-clamp-3 ${isGritty ? 'text-gray-300' : 'text-gray-700'}`}>{report.originalText}</p>
                    </>
                  </div>
                  <button
                    onClick={() => onSelectReport(report)}
                    disabled={isLoadingAny}
                    className={`mt-4 px-4 py-2 font-comic text-sm uppercase tracking-wider 
                                ${isLoadingAny ? 'bg-gray-600' : (isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500')} 
                                text-white comic-border border-white self-start`}
                  >
                    {UI_TEXT.REPORT_LIST.VIEW_DETAILS_BUTTON}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          !isLoadingAny && ( // Not loading any, but no reports available
            <p className={`text-center py-8 text-lg italic ${isGritty ? 'text-gray-400' : 'text-gray-600'}`}>
              {UI_TEXT.REPORT_LIST.NO_REPORTS_AVAILABLE}
            </p>
          )
        )}
      </div>
    );
  }

  // Render details of selected report (always fully detailed with hardcoded data)
  return (
    <div className={`comic-border p-6 mt-8 ${isGritty ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-900'}`}>
      <h3 className={`text-2xl font-comic uppercase mb-4 ${isGritty ? 'text-red-500' : 'text-blue-700'}`}>
        {UI_TEXT.SELECTED_REPORT_VIEW.TITLE}
      </h3>

      <div className={`comic-border p-4 mt-6 ${isGritty ? 'bg-black text-white border-red-600' : 'bg-white text-gray-900 border-blue-700'}`}>
        {/* With hardcoded reports, details are always loaded */}
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
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={() => onGenerateComicFromReport(selectedReport)}
            disabled={isGeneratingComic}
            className={`px-6 py-3 font-comic text-lg uppercase tracking-wider 
                        ${isGeneratingComic ? 'bg-gray-600 cursor-not-allowed' : (isGritty ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500')} 
                        text-white comic-border border-white`}
          >
            {isGeneratingComic ? 'Generating Comic...' : UI_TEXT.SELECTED_REPORT_VIEW.GENERATE_COMIC_BUTTON}
          </button>
          <button
            onClick={onBackToList}
            disabled={isLoadingAny}
            className={`px-4 py-2 font-comic text-sm uppercase ${isGritty ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-300'} text-white comic-border border-white`}
          >
            {UI_TEXT.SELECTED_REPORT_VIEW.BACK_TO_LIST_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportListAndDetail;