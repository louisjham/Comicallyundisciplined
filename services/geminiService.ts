
import { GoogleGenAI, Type } from "@google/genai";
import { ComicStrip, ReportSummary, AppMode } from "../types";
import { AI_INSTRUCTIONS, STYLE_PROMPTS } from "../constants/content";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async fetchRandomReport(): Promise<ReportSummary> {
    const ai = getAI();
    const seed = Date.now().toString().slice(-6);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: AI_INSTRUCTIONS.SEARCH_PROMPT(seed),
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            incidentDate: { type: Type.STRING },
            officerName: { type: Type.STRING },
            allegation: { type: Type.STRING },
            outcome: { type: Type.STRING },
            originalText: { type: Type.STRING },
            sourceUrl: { type: Type.STRING },
          },
          required: ["incidentDate", "officerName", "allegation", "outcome", "originalText", "sourceUrl"]
        }
      }
    });

    try {
      const data = JSON.parse(response.text.trim());
      const groundingUrl = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.find(c => c.web?.uri?.includes('.pdf'))?.web?.uri 
                          || response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri;
      
      if ((!data.sourceUrl || data.sourceUrl.includes('google.com')) && groundingUrl) {
        data.sourceUrl = groundingUrl;
      }
      return data;
    } catch (e) {
      console.error("Failed to parse report summary:", e);
      throw new Error("Could not extract a valid incident report.");
    }
  },

  async generateComicScript(report: ReportSummary, mode: AppMode): Promise<ComicStrip> {
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        REPORT DATA:
        Officer: ${report.officerName}
        Allegation: ${report.allegation}
        Incident: ${report.originalText}
        Outcome: ${report.outcome}

        INSTRUCTIONS:
        Create a 4-panel strip based on the ${mode === 'gritty' ? 'Verbatim' : 'Superhero Parody'} style.
      `,
      config: {
        systemInstruction: AI_INSTRUCTIONS.SCRIPT_SYSTEM(mode),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            originalSummary: { type: Type.STRING },
            panels: {
              type: Type.ARRAY,
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
    });

    const parsed = JSON.parse(response.text.trim());
    return { ...parsed, sourceUrl: report.sourceUrl };
  },

  async generatePanelImage(visualPrompt: string, mode: AppMode): Promise<string> {
    const ai = getAI();
    const fullPrompt = `${visualPrompt} | Style: ${STYLE_PROMPTS[mode]}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: fullPrompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned from Gemini");
  }
};
