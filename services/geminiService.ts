import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ComicStrip, ReportSummary, AppMode } from "../types";
import { AI_INSTRUCTIONS, STYLE_PROMPTS } from "../constants/content";
import { HARDCODED_REPORTS } from "../constants/hardcodedReports"; // Import hardcoded reports

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Utility to wrap API calls with exponential backoff for transient errors (503, 429)
 */
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // Extract status code if available, otherwise look for markers in message
      const status = err.status || 
                    (err.message?.includes('503') ? 503 : 
                    (err.message?.includes('429') ? 429 : 0));
      
      if (status === 503 || status === 429) {
        console.warn(`Gemini API busy (${status}). Retry attempt ${i + 1}/${maxRetries}...`);
        const delay = Math.pow(2, i) * 1500 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export const geminiService = {
  /**
   * Provides a list of hardcoded disciplinary reports from a local library.
   * This replaces dynamic discovery and extraction.
   */
  getHardcodedReports(): ReportSummary[] {
    return HARDCODED_REPORTS;
  },

  async fetchScrapedReport(): Promise<ReportSummary> {
    const res = await fetch('/api/reports/scrape');
    if (!res.ok) {
      throw new Error("Failed to dynamically fetch new report forms");
    }
    return await res.json();
  },

  async generateComicScript(report: ReportSummary, mode: AppMode): Promise<ComicStrip> {
    const ai = getAI();
    
    const response: GenerateContentResponse = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        OFFICER: ${report.officerName}
        ALLEGATION: ${report.allegation}
        REPORT SUMMARY: ${report.originalText}
      `,
      config: {
        systemInstruction: AI_INSTRUCTIONS.SCRIPT_SYSTEM(mode),
        temperature: 0.7, // Lower temperature for more adherence to facts
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            originalSummary: { type: Type.STRING },
            panels: {
              type: Type.ARRAY,
              minItems: 2, // Minimum 2 panels
              maxItems: 4, // Maximum 4 panels
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  narration: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  speechBubble: { type: Type.STRING }
                },
                required: ["id", "narration", "visualPrompt"]
              }
            }
          },
          required: ["title", "originalSummary", "panels"]
        }
      }
    }));

    const text = response.text || '';
    if (!text) throw new Error("Script generation failed to return content.");
    
    // Robustly extract JSON string, handling potential markdown wrappers or extra text
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    let jsonString = text;
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    } else {
      // If no valid JSON structure found, log the raw text for debugging
      console.warn("Could not find a valid JSON object in the model's response. Raw text:", text);
      throw new Error("Model response was not valid JSON or was truncated.");
    }

    const parsed = JSON.parse(jsonString); 
    return { ...parsed, sourceUrl: report.sourceUrl };
  },

  async generatePanelImage(visualPrompt: string, mode: AppMode, skipImageGen: boolean = false): Promise<string> {
    if (skipImageGen) {
      return this.getFallbackImage(mode, visualPrompt);
    }

    const ai = getAI();
    const style = STYLE_PROMPTS[mode];
    const fullPrompt = `${style}: ${visualPrompt}`;
    
    try {
      // Direct call without retry for images to avoid long waits un der rate limit
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      throw new Error("No image data returned from Gemini");
    } catch (err: any) {
      console.error("Image generation failed, falling back to placeholder:", err);
      return this.getFallbackImage(mode, visualPrompt);
    }
  },

  getFallbackImage(mode: AppMode, promptText: string): string {
    const bgColor = mode === 'gritty' ? '#2d3748' : '#3182ce';
    const textColor = mode === 'gritty' ? '#a0aec0' : '#fbd38d';
    // Truncate prompt for SVG text block
    const shortPrompt = promptText.substring(0, 40) + '...';
    const fakeSvg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text x="50%" y="45%" font-family="impact, sans-serif" font-size="40" fill="${textColor}" text-anchor="middle">IMAGE UNAVAILABLE</text>
      <text x="50%" y="55%" font-family="sans-serif" font-size="20" fill="${textColor}" text-anchor="middle">(Fast Mode / Rate Limit)</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(fakeSvg)}`;
  }
};