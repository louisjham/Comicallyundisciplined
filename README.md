
# 💥 Comically unDisciplined

**Comically unDisciplined** is an experimental AI-powered application that transforms official, bureaucratic police disciplinary reports from the City of Austin into short, punchy urban superhero comic strips.

Using the **Gemini 3 Pro & Flash** models, the app scrapes public oversight documents, synthesizes the narrative conflict, and generates visual panels using high-speed AI image generation.

## 🚀 Features

- **Real Data Acquisition**: Uses Gemini's Google Search grounding to discover and summarize actual incident reports from the Austin Police Department's public records (austintexas.gov).
- **AI Scripting**: Gemini 3 Flash analyzes dry legal documents to create a 4-panel dramatic script.
- **Dynamic Inking**: Generates 2D rough-ink style comic panels for every story.
- **Interactive UI**: A high-contrast, comic-book inspired interface with Ben-Day dot patterns and dynamic loading states.

## 🛠️ Tech Stack

- **React 19**: Modern UI component architecture.
- **Google Gemini API**: 
  - `gemini-3-flash-preview`: For high-speed text analysis, scripting, and web document summary/extraction via `googleSearch` tool.
  - `gemini-2.5-flash-image`: For fast, stylized comic art generation.
  - `googleSearch` tool: For grounding and finding real-world report URLs and their content.
- **Tailwind CSS**: Utility-first styling with a custom "Comic" aesthetic.
- **TypeScript**: Type-safe development.

## 🗝️ Setup & Environment

This app requires a Google Gemini API Key. 

1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. Ensure the key is available in your environment as `API_KEY`.

## 📜 Legal & Disclaimer

This application uses public data for educational and artistic purposes. The comic visualizations are AI-generated interpretations of factual disciplinary reports and should be viewed alongside the original source documents provided within the app. Due to frontend technical limitations, the application relies on the Gemini API's Google Search grounding for document discovery and content extraction, which may occasionally result in varied accuracy or availability.

---
*Built with ⚡ by the Metro City Oversight Team.*