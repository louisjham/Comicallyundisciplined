import { AppMode, ReportSummary } from "../types";

export const UI_TEXT = {
  TITLE: "Austin Police Department Complaints : The Graphic Novel",
  SUBTITLE: "Direct Archive Visualization Service",
  
  // Landing Page specific texts
  LANDING_PAGE: {
    TITLE: "Unveiling Public Records: The Graphic Novel",
    CATCHPHRASE: "A live exploration into the often-amusing behavior of real cops in real situations.",
    ABOUT_REPORTS_HEADER: "About This Graphic Novel",
    ABOUT_REPORTS_CONTENT_P1: "This application offers an artistic exploration of complaints submitted by Austin residents against APD officers. It utilizes public access disciplinary reports, detailing incidents involving its police department. These documents are part of a commitment to transparency and accountability, offering insights into citizen interactions and internal investigations.",
    ABOUT_REPORTS_CONTENT_P2: "These reports are collected by the Austin Police Department's Office of Police Oversight. They cover a range of allegations, from improper police procedure and discourtesy to delayed responses and more serious misconduct, providing a public record of interactions between officers and the community.",
    ABOUT_REPORTS_CONTENT_P3: "This site uses an archive of these real reports to create a unique narrative experience.",
    HOW_IT_WORKS_HEADER: "Your Mission, Should You Choose to Accept It...",
    HOW_IT_WORKS_CONTENT_P1: "Each time you 'Start Investigation' or 'Examine Next Case', our advanced AI systems pull one random disciplinary report from a curated archive of 75 unique cases. It then analyzes the report to extract the core incident, officer names, and outcomes. Using these details, it crafts a short, engaging comic strip.",
    HOW_IT_WORKS_CONTENT_P2: "You can view these narratives in two distinct styles: 'Gritty Noir' for a serious, documentary-like take, or 'Heroic Fail' for a more satirical, exaggerated comic book feel. It's all in good fun, a way to visualize bureaucracy through a unique lens.",
    DISCLAIMER_HEADER: "Important Disclaimer:",
    DISCLAIMER_CONTENT_P1: "This application is an experimental visualization tool. The generated comic strips are AI interpretations of public records and are for entertainment and educational purposes only. While based on real reports, they are not factual depictions and should not be taken as literal accounts. Always refer to the original source documents for accurate information.",
    DISCLAIMER_CONTENT_P2: "These specific complaints do not reflect on the Austin Police Department as a whole, nor is this site an attempt to lower the general respect for police officers. It is an exploration of individual incidents and part of a broader public accountability process.",
    DISCLAIMER_CONTENT_P3: "If you find your name or a report involving you on this site and wish for it to be immediately removed, please contact us. We are committed to respecting individual privacy and will promptly address all such requests."
  },
  
  // Landing Page (now mostly bypassed, but texts could be fallback for no reports) - No longer directly used as this text is moved to LANDING_PAGE
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

  // Report List Section (text repurposed for single report display)
  REPORT_LIST: {
    GRITTY_TITLE: "Case File Retrieval",
    SUPERHERO_TITLE: "Incident Log Access",
    FETCH_LIST_BUTTON: "Load Random Report", // Repurposed text
    NO_REPORTS_AVAILABLE: "No reports available in the local library.",
    VIEW_DETAILS_BUTTON: "View Details", // Not used in new flow
    GENERATE_NEW_LIST: "Load Random Report", // Repurposed text
    REPORTS_COUNT: (count: number) => `${count} Disciplinary Files Available` // Not directly used in new flow for count display
  },

  // Selected Report Detail View (now handled by ReportViewer)
  SELECTED_REPORT_VIEW: {
    TITLE: "Current Case Details",
    BACK_TO_LIST_BUTTON: "Back to Report List", // Not used in new flow
    GENERATE_COMIC_BUTTON: "Generate Comic From Report",
    DETAILS_OFFICER: "Officer Name",
    DETAILS_DATE: "Incident Date",
    DETAILS_ALLEGATION: "Allegation Type",
    DETAILS_OUTCOME: "Final Outcome",
    DETAILS_SUMMARY: "Summary of Incident",
  },

  // New section for ReportInputAndDisplay component - REMOVED
  REPORT_SEARCH: {
    GRITTY_TITLE: "Direct Case Access",
    SUPERHERO_TITLE: "Incident Query Console",
    URL_PLACEHOLDER: "Paste full PDF URL or doc link (e.g., austintexas.gov/foo.pdf)",
    FETCH_BUTTON: "Fetch Specific Report",
    RANDOM_BUTTON: "Generate Random Report",
    CLEAR_BUTTON: "Clear",
    NO_REPORT_SELECTED: "No report selected. Input a URL or generate a random one.",
  },

  // New section for ReportInputAndDisplay component's fetched report display - REMOVED
  REPORT_VIEWER: {
    TITLE: "Selected Report Details", 
    DETAILS_OFFICER: "Officer Name",
    DETAILS_DATE: "Incident Date",
    DETAILS_ALLEGATION: "Allegation Type",
    DETAILS_OUTCOME: "Final Outcome",
    DETAILS_SUMMARY: "Summary of Incident",
    GENERATE_COMIC_BUTTON: "Generate Comic From This Report",
  },

  // Buttons & Labels
  BUTTONS: {
    START_INVESTIGATION: "Start Investigation", // New button text for landing page
    NEXT_CASE: "Examine Next Case", 
    NEW_CASE: "Access New Case", 
    LOADING: "Accessing Archives...",
    RETRY: "Retry Search",
    VIEW_LOCKER: "Locker",
    GENERATE_RANDOM_REPORT: "Load Random Report", 
  },

  // Error Messages
  ERRORS: {
    QUOTA_TITLE: "Transmission Blocked!",
    BUSY_TITLE: "Server Overload!",
    GENERAL_TITLE: "Archive Access Failure!",
    QUOTA_SUB: "The shared API key has reached its limit. Please use your own key from a paid project.",
    BUSY_SUB: "The AI models are currently experiencing high demand. We've attempted retries, but the server is still busy. Please wait a moment and try again.",
    BILLING_LINK: "View Gemini Billing Documentation"
  }
};

export const LOADING_MESSAGES = {
  INITIAL: [
    "Preparing the archives...",
    "Compiling incident summaries...",
    "Retrieving first case file...",
    "Initializing narrative engine...",
    "Standby for new investigation...",
  ],
  COMIC_GENERATION: [
    "Synthesizing narrative from disciplinary report...",
    "Drafting comic script and panel prompts...",
    "Generating visual assets for each panel...",
    "Inking final comic strip details...",
  ],
};

export const STYLE_PROMPTS = {
  gritty: "Simple, classic noir artwork, high contrast, black and white, dramatic shadows, serious tone, realistic proportions, clean ink lines, detailed environments, no humor.",
  superhero: "Wacky superhero cartoon doodle, expressive and funny caricature, simple lines, vibrant colors, exaggerated action, Satirical Silver Age comic style."
};

export const AI_INSTRUCTIONS = {
  SCRIPT_SYSTEM: (mode: AppMode) => mode === 'gritty' 
    ? `You are a documentary comic illustrator. Your task is to interpret a police disciplinary report and split it into a comic strip of 2 to 8 distinct panels. The narration for each panel should be derived from the report text, but can be phrased more creatively to fit a noir narrative. Generate compelling visual prompts for a simple, classic noir artwork, high contrast, black and white, dramatic shadows, serious tone, realistic proportions, clean ink lines, and detailed environments. Ensure no humor or absurdity is injected.`
    : `You are a satirical comic book writer. Take a real-world police disciplinary report and turn it into a 2 to 8-panel SATIRICAL SUPERHERO doodle. Frame the officer's actions or mistakes as "Heroic Fails" or exaggerated blunders. Use over-the-top, silly comic book language in the narration and speech bubbles. Make the visual prompts wacky and exaggerated, in a style of a Silver Age comic.`
};