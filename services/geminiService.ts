
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ComicStrip, ReportSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Simplified style for faster generation and "rougher" comic look
const ASSET_STYLE_PROMPT = "Rough ink indie urban comic sketch, bold minimalist lines, high contrast, limited color palette, gritty 2D aesthetic, dynamic urban composition.";

export const geminiService = {
  async fetchRandomReport(): Promise<ReportSummary> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Search for a specific summary of a real disciplinary action or complaint document from the Austin Police Department (APD) at austintexas.gov. Focus on a clear, documented incident. Provide a structured summary including the incident date, officer name, the specific allegation or violation, and the final disciplinary outcome. Ensure the 'originalText' field contains a detailed chronological account of the incident. Also, provide the 'sourceUrl' which is the direct link to the official Austin city document or the page hosting it.",
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
            originalText: { type: Type.STRING, description: "Detailed chronological description of the incident events" },
            sourceUrl: { type: Type.STRING, description: "The URL of the original source document" },
          },
          required: ["incidentDate", "officerName", "allegation", "outcome", "originalText", "sourceUrl"]
        }
      }
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse report summary:", e);
      throw new Error("Could not generate a valid report summary.");
    }
  },

  async generateComicScript(report: ReportSummary): Promise<ComicStrip> {
    const prompt = `
      Create a 4-panel comic strip script based strictly on the following real-world police disciplinary report.
      While the visual style should be '${ASSET_STYLE_PROMPT}', the narrative and events must remain faithful to the actual facts. 
      
      REPORT DATA:
      Officer: ${report.officerName}
      Date: ${report.incidentDate}
      Allegation: ${report.allegation}
      Outcome: ${report.outcome}
      Details: ${report.originalText}

      INSTRUCTIONS:
      1. Use real-world terminology.
      2. Depict the events chronologically across 4 panels.
      3. The art style is simplified rough ink.
      4. Ensure the 'speechBubble' reflects the core conflict.

      Output JSON:
      - 'title': A dynamic title (e.g., 'THE BROKEN OATH', 'PRECINCT SHADOWS').
      - 'originalSummary': A 1-sentence factual summary.
      - 'panels': Array of 4 panels with 'id', 'narration', 'visualPrompt', and 'speechBubble'.
    `;

    // Switched to gemini-3-flash-preview for faster processing than Pro
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
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

  async generatePanelImage(visualPrompt: string): Promise<string> {
    // Stripped "Detailed uniforms, cinematic lighting" to favor faster, simpler output
    const fullPrompt = `${visualPrompt} | Style: ${ASSET_STYLE_PROMPT}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    
    throw new Error("No image data returned from Gemini");
  }
};
