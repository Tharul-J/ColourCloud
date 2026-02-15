import { GoogleGenAI, Type, Chat } from "@google/genai";
import { GradientPalette, CustomGenerationOptions } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Keep the chat session instance in memory for continuity
let chatSession: Chat | null = null;

const MODEL_ID = "gemini-3-flash-preview";

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
  try {
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
      return JSON.parse(response.text) as GradientPalette[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating gradients:", error);
    throw error;
  }
};

export const generateCustomPalettes = async (options: CustomGenerationOptions): Promise<GradientPalette[]> => {
  try {
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
  } catch (error) {
    console.error("Error generating custom palettes:", error);
    throw error;
  }
};

export const generateCuratedPalettes = async (): Promise<GradientPalette[]> => {
  try {
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
  } catch (error) {
    console.error("Error generating curated palettes:", error);
    throw error;
  }
};

export const sendMessageToBot = async (message: string): Promise<string> => {
  try {
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