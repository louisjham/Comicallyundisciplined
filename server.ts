import express from "express";
import { createServer as createViteServer } from "vite";
import * as path from "path";
import * as url from "url";
import * as cheerio from "cheerio";
import { createRequire } from "module";
import { GoogleGenAI, Type } from "@google/genai";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch and parse disciplinary reports
  app.get("/api/reports/scrape", async (req, res) => {
    try {
      console.log("Scraping Austin Texas Police Memos...");
      
      // 1. Scrape the Austin City website for links
      const SCRAPE_URL = "https://www.austintexas.gov/department/police/disciplinary-reports";
      const htmlResponse = await fetch(SCRAPE_URL);
      if (!htmlResponse.ok) throw new Error("Failed to fetch reports page");
      const html = await htmlResponse.text();
      
      const $ = cheerio.load(html);
      const links: string[] = [];
      
      $('a[href$=".pdf"]').each((_, el) => {
        const href = $(el).attr("href");
        if (href) {
          const absoluteUrl = href.startsWith('http') ? href : `https://www.austintexas.gov${href.startsWith('/') ? '' : '/'}${href}`;
          links.push(absoluteUrl);
        }
      });
      
      if (links.length === 0) {
        return res.status(404).json({ error: "No PDF links found." });
      }

      console.log(`Found ${links.length} PDF links. Picking a random one to parse...`);
      // Pick a random recent memo to avoid parsing all at once (which takes too long)
      const randomUrl = links[Math.floor(Math.random() * Math.min(links.length, 20))];
      
      console.log(`Downloading PDF: ${randomUrl}`);
      
      const pdfResponse = await fetch(randomUrl);
      if (!pdfResponse.ok) throw new Error("Failed to download PDF");
      const pdfBuffer = await pdfResponse.arrayBuffer();
      
      const pdfData = await pdf(Buffer.from(pdfBuffer));
      const pdfText = pdfData.text.replace(/\s+/g, " ").substring(0, 8000); // Take first 8000 chars roughly to fit in context
      
      console.log("PDF parsed. Extracting data with Gemini...");

      // Summarize with Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY not found in environment variables.");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const extractPrompt = `
        Extract the following disciplinary report details from the given text of a police memo:
        - incidentDate: Date of the incident
        - officerName: Name of the officer involved
        - allegation: Brief 1-2 sentence allegation description
        - outcome: Form of discipline (e.g., 2 day suspension)
        - originalText: A short 2-3 paragraph objective summary of what happened.

        Memo Text:
        ${pdfText}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: extractPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              incidentDate: { type: Type.STRING },
              officerName: { type: Type.STRING },
              allegation: { type: Type.STRING },
              outcome: { type: Type.STRING },
              originalText: { type: Type.STRING }
            },
            required: ["incidentDate", "officerName", "allegation", "outcome", "originalText"]
          }
        }
      });

      const extractedText = response.text || "{}";
      const reportData = JSON.parse(extractedText);
      reportData.sourceUrl = randomUrl;

      console.log("Data extracted successfully!");
      res.json(reportData);

    } catch (error: any) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: error.message || "Failed to scrape report" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
