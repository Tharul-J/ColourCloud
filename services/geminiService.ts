import { GoogleGenAI, Type, Chat } from "@google/genai";
import { GradientPalette, CustomGenerationOptions } from "../types";

// Multiple API keys for rotation/fallback
const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3
].filter(Boolean); // Remove undefined keys

let currentKeyIndex = 0;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Simple cache to avoid repeated API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get current API key and rotate
const getApiKey = () => API_KEYS[currentKeyIndex % API_KEYS.length];

// Rotate to next key on quota error
const rotateApiKey = () => {
  currentKeyIndex++;
  console.log(`Rotated to API key ${(currentKeyIndex % API_KEYS.length) + 1}`);
};

// Rate limiting check
const checkRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
};

const getAIInstance = () => new GoogleGenAI({ apiKey: getApiKey() });

// Keep the chat session instance in memory for continuity
let chatSession: Chat | null = null;

// Using lite model for faster response times
const MODEL_ID = "models/gemini-2.5-flash-lite";

const PALETTE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      colors: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      direction: { type: Type.STRING }
    },
    required: ["name", "description", "colors", "direction"],
    propertyOrdering: ["name", "description", "colors", "direction"]
  }
};

export const generateGradients = async (baseColor: string, count: number = 8): Promise<GradientPalette[]> => {
  // Check cache first
  const cacheKey = `gradients-${baseColor}-${count}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached gradients');
    return cached.data;
  }

  // Rate limiting
  await checkRateLimit();

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const ai = getAIInstance();
      const prompt = `
        Generate ${count} unique, aesthetically pleasing gradient color palettes based on or complementary to the base color: ${baseColor}.
        
        For each palette:
        1. Give it a creative name.
        2. Provide a short description of the vibe.
        3. Provide an array of 2 to 4 hex color codes that make up the gradient. Ensure they blend well.
        4. Suggest a CSS gradient direction (e.g., "to right", "to bottom right", "45deg").
      `;

      const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: PALETTE_SCHEMA
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text) as GradientPalette[];
        // Cache the result
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
      throw new Error("No data returned from Gemini");
    } catch (error: any) {
      // Check if it's a quota error
      if (error?.message?.includes("quota") || error?.message?.includes("429")) {
        console.error(`Quota exceeded on key ${currentKeyIndex + 1}, trying next key...`);
        rotateApiKey();
        if (attempt === API_KEYS.length - 1) {
          throw new Error("All API keys have exceeded their quota. Free tier limits: ~15 requests/min. Please wait a few minutes or upgrade to paid tier.");
        }
        continue; // Try next key
      }
      console.error("Error generating gradients:", error);
      throw error;
    }
  }
  throw new Error("Failed to generate gradients");
};

export const generateCustomPalettes = async (options: CustomGenerationOptions): Promise<GradientPalette[]> => {
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const ai = getAIInstance();
      const prompt = `
        Generate ${options.count} unique color palettes with the following requirements:
        - Base Color: ${options.baseColor} (Use this as a starting point or accent)
        - Mood/Style: ${options.mood}
        - Topic/Theme: ${options.topic}
        
        Ensure the colors strictly follow the requested mood and topic.
        Provide CSS gradient directions suitable for modern UI design.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: PALETTE_SCHEMA
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as GradientPalette[];
      }
      throw new Error("No data returned from Gemini");
    } catch (error: any) {
      if (error?.message?.includes("quota") || error?.message?.includes("429")) {
        rotateApiKey();
        if (attempt === API_KEYS.length - 1) {
          throw new Error("All API keys have exceeded their quota.");
        }
        continue;
      }
      console.error("Error generating custom palettes:", error);
      throw error;
    }
  }
  throw new Error("Failed to generate custom palettes");
};

export const generateCuratedPalettes = async (): Promise<GradientPalette[]> => {
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const ai = getAIInstance();
      const prompt = `
        Generate 12 unique, high-quality, and trending gradient color palettes.
        Mix different styles: Pastel, Neon, Dark Mode, Nature-inspired, and Retro.
        These should be suitable for professional web design and app interfaces.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: PALETTE_SCHEMA
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as GradientPalette[];
      }
      throw new Error("No data returned from Gemini");
    } catch (error: any) {
      if (error?.message?.includes("quota") || error?.message?.includes("429")) {
        rotateApiKey();
        if (attempt === API_KEYS.length - 1) {
          throw new Error("All API keys have exceeded their quota.");
        }
        continue;
      }
      console.error("Error generating curated palettes:", error);
      throw error;
    }
  }
  throw new Error("Failed to generate curated palettes");
};

export const sendMessageToBot = async (message: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: MODEL_ID,
        config: {
          systemInstruction: "You are ColourClouds AI, an expert Color Theorist and UI/UX Designer. Your goal is to help users find the perfect color palettes for their projects. Ask clarifying questions about the user's topic (e.g., 'What is the app about?', 'What emotions do you want to convey?'). Provide hex codes and explain why certain colors work well together."
        }
      });
    }

    const response = await chatSession.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending message to bot:", error);
    return "Sorry, I encountered an error connecting to the AI.";
  }
};