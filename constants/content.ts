
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
  gritty: "Funny caricature noir sketch, messy ink, exaggerated facial expressions, minimalist documentary doodle style, sketchy and loose.",
  superhero: "Wacky superhero cartoon doodle, expressive and funny caricature, simple lines, vibrant colors, exaggerated action, Satirical Silver Age comic style."
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
    ? `You are a cynical documentary comic illustrator. Take the VERBATIM text from a police disciplinary report and split it into 4 funny noir panels. Focus on the absurdity of the bureaucratic language. Narrate using direct quotes. Make the visual prompts feel like a dark, funny detective sketch.`
    : `You are a satirical comic book writer. Take a real-world police disciplinary report and turn it into a 4-panel SATIRICAL SUPERHERO doodle. Frame the officer's mistake as a "Heroic Fail." Use over-the-top, silly comic book language. Make the visual prompts wacky and exaggerated.`
};
