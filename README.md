# 💥 Comically unDisciplined

**Comically unDisciplined** is an experimental AI-powered application that transforms official, bureaucratic police disciplinary reports from the City of Austin into short, punchy urban superhero comic strips.

Using the **Gemini 3 Pro & Flash** models, the app scrapes public oversight documents, synthesizes the narrative conflict, and generates visual panels using high-speed AI image generation.

## 🚀 Features

- **Real Data Integration**: Pulls actual incident summaries from the Austin Police Department's public records.
- **AI Scripting**: Gemini 3 Flash analyzes dry legal documents to create a 4-panel dramatic script.
- **Dynamic Inking**: Generates 2D rough-ink style comic panels for every story.
- **Interactive UI**: A high-contrast, comic-book inspired interface with Ben-Day dot patterns and dynamic loading states.

## 🛠️ Tech Stack

- **React 19**: Modern UI component architecture.
- **Google Gemini API**: 
  - `gemini-3-flash-preview`: For high-speed text analysis and scripting.
  - `gemini-2.5-flash-image`: For fast, stylized comic art generation.
  - `googleSearch`: For grounding and finding real-world report URLs.
- **Tailwind CSS**: Utility-first styling with a custom "Comic" aesthetic.
- **TypeScript**: Type-safe development.

## 🗝️ Setup & Environment

This app requires a Google Gemini API Key. 

1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. Ensure the key is available in your environment as `API_KEY`.

## 📜 Legal & Disclaimer

This application uses public data for educational and artistic purposes. The comic visualizations are AI-generated interpretations of factual disciplinary reports and should be viewed alongside the original source documents provided within the app.

---
*Built with ⚡ by the Metro City Oversight Team.*
