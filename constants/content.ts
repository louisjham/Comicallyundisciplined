
import { AppMode } from "../types";

export const UI_TEXT = {
  TITLE: "Real Life Tales from the APD Complaint Reports",
  SUBTITLE: "Direct Archive Visualization Service",
  
  // Landing Page
  LANDING: {
    GRITTY: {
      TITLE: "Documentary Archive Protocol",
      DESCRIPTION: "Access the official Austin Police Department archives to visualize real-world incident summaries in a verbatim noir narrative."
    },
    SUPERHERO: {
      TITLE: "The Hall of Heroic Blunders",
      DESCRIPTION: "Explore the most absurd moments from the archives, reimagined as a satirical Silver Age superhero chronicle."
    },
    BUTTON: "Initialize Search"
  },

  // Case Header
  CASE_HEADER: {
    GRITTY: "Bureau of Internal Oversight Case File",
    SUPERHERO: "The Chronicle of Metro City Failures",
    SOURCE_LINK: "View Original Public Record ↗",
    STAMP_GRITTY: "Verified Public Record",
    STAMP_SUPERHERO: "Sardonic Edition",
    ARCHIVED_BADGE: "Retrieved from Evidence Locker"
  },

  // Archive UI
  LOCKER: {
    TITLE: "Evidence Locker",
    SUBTITLE: "Last 20 Archived Case Files",
    EMPTY: "No files found in the locker. Generate a case to archive it.",
    CLOSE: "Close Locker",
    STAMP: "CLOSED CASE"
  },

  // Buttons & Labels
  BUTTONS: {
    NEXT_CASE: "Examine Next Case",
    NEW_CASE: "Access New Case",
    LOADING: "Accessing Archives...",
    RETRY: "Retry Search",
    VIEW_LOCKER: "Locker"
  },

  // Error Messages
  ERRORS: {
    QUOTA_TITLE: "Transmission Blocked!",
    GENERAL_TITLE: "Archive Access Failure!",
    QUOTA_SUB: "The shared API key has reached its limit. Please use your own key from a paid project.",
    BILLING_LINK: "View Gemini Billing Documentation"
  }
};

export const LOADING_MESSAGES = [
  "Accessing Austin Public Record Archives...",
  "Retrieving Disciplinary PDF Data...",
  "Analyzing Official APD Incident Summaries...",
  "Rendering Graphic Narrative from Verbatim Logs...",
  "Chronologically Sequencing Evidence...",
  "Processing Case Exhibits 1 through 4...",
  "Confirming Source Grounding for Public Record..."
];

export const STYLE_PROMPTS = {
  gritty: "Modern graphic novel art, high-contrast ink, cinematic noir lighting, detailed line work, muted documentary color palette, realistic proportions, high resolution.",
  superhero: "Vibrant Silver Age superhero comic art, 3D semi-realistic rendering, bold outlines, cinematic lighting, high-action poses, dramatic perspective, 4-color process aesthetic, fantasy-tech setting."
};

export const AI_INSTRUCTIONS = {
  SEARCH_PROMPT: (seed: string) => `Search the Austin Police Department (APD) document archives at austintexas.gov for a REAL 'Notice of Formal Suspension' or 'Disciplinary Action' PDF. 
      
      CRITICAL: You must find a specific individual disciplinary case. Use search query randomization: ${seed}.
      
      Extract the FOLLOWING exactly from the document:
      1. The official name of the officer.
      2. The date of the incident.
      3. The 'Summary of Incident' section—this should be the verbatim narrative.
      4. The specific disciplinary outcome (e.g., 3-day suspension).
      5. The DIRECT URL to the PDF document on austintexas.gov.`,

  SCRIPT_SYSTEM: (mode: AppMode) => mode === 'gritty' 
    ? `You are a documentary comic illustrator. Your task is to take the VERBATIM bureaucratic text from an official police report and split it into a 4-panel graphic novel strip. RULES: Use segments of the 'originalText' exactly as written. The narration must be a direct quote.`
    : `You are a satirical comic book writer. Take the following real-world police disciplinary report and turn it into a 4-panel SATIRICAL SUPERHERO comic strip. Frame the officer's mistake as a "Heroic Fail" or a "Supervillain Move." Use over-the-top comic book language.`
};
