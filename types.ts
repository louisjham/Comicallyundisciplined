
export interface ComicPanel {
  id: number;
  narration: string;
  visualPrompt: string;
  imageUrl?: string;
  speechBubble?: string;
}

export interface ComicStrip {
  title: string;
  originalSummary: string;
  panels: ComicPanel[];
  sourceUrl?: string;
}

export interface ReportSummary {
  incidentDate: string;
  officerName: string;
  allegation: string;
  outcome: string;
  originalText: string;
  sourceUrl?: string;
}
