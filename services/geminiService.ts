import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";
import { GradientPalette, CustomGenerationOptions } from "../types";

extend([mixPlugin, namesPlugin]);

// Color theory utilities
const rotateHue = (color: string, degrees: number) => colord(color).rotate(degrees).toHex();
const lighten = (color: string, amount: number) => colord(color).lighten(amount).toHex();
const darken = (color: string, amount: number) => colord(color).darken(amount).toHex();
const saturate = (color: string, amount: number) => colord(color).saturate(amount).toHex();
const desaturate = (color: string, amount: number) => colord(color).desaturate(amount).toHex();
const mix = (color1: string, color2: string, ratio: number = 0.5) => 
  colord(color1).mix(color2, ratio).toHex();

// Gradient directions pool
const directions = [
  "to right",
  "to bottom right",
  "to bottom",
  "to bottom left",
  "to left",
  "135deg",
  "45deg",
  "90deg",
  "180deg"
];

// Palette name generators
const paletteNames = {
  analogous: ["Harmony", "Flow", "Cascade", "Melody", "Symphony", "Rhythm", "Breeze"],
  complementary: ["Contrast", "Balance", "Duality", "Eclipse", "Fusion", "Unity", "Equilibrium"],
  triadic: ["Trinity", "Triad", "Triangle", "Spectrum", "Prism", "Rainbow", "Kaleidoscope"],
  monochromatic: ["Gradient", "Fade", "Depth", "Layers", "Shades", "Tones", "Nuance"],
  splitComplementary: ["Split", "Diverge", "Branch", "Fork", "Divide", "Harmony Plus"],
  tetradic: ["Square", "Quartet", "Four Corners", "Cross", "Quad"],
  vibrant: ["Energy", "Vibrant", "Bold", "Vivid", "Electric", "Neon", "Pop"],
  pastel: ["Soft", "Gentle", "Whisper", "Dream", "Cloud", "Silk", "Powder"],
  warm: ["Sunset", "Autumn", "Fire", "Warmth", "Copper", "Amber", "Glow"],
  cool: ["Ocean", "Ice", "Winter", "Frost", "Arctic", "Azure", "Chill"],
  earthy: ["Nature", "Earth", "Forest", "Terra", "Wood", "Stone", "Clay"]
};

const descriptors = {
  analogous: "harmonious colors that sit next to each other",
  complementary: "bold contrast with opposite colors",
  triadic: "balanced trio of evenly spaced colors",
  monochromatic: "elegant variations of a single hue",
  splitComplementary: "sophisticated three-color harmony",
  tetradic: "rich four-color combination",
  vibrant: "energetic and saturated tones",
  pastel: "soft and calming shades",
  warm: "cozy and inviting warmth",
  cool: "refreshing and calm vibes",
  earthy: "grounded natural tones"
};

// Generate palette name
const generateName = (type: string, baseColor: string): string => {
  const colorName = colord(baseColor).toName({ closest: true }) || "Color";
  const names = paletteNames[type as keyof typeof paletteNames] || paletteNames.analogous;
  const name = names[Math.floor(Math.random() * names.length)];
  return `${colorName} ${name}`;
};

// Color harmony generators
const generateAnalogous = (baseColor: string): string[] => {
  return [
    baseColor,
    rotateHue(baseColor, 30),
    rotateHue(baseColor, 60)
  ];
};

const generateComplementary = (baseColor: string): string[] => {
  return [
    baseColor,
    mix(baseColor, rotateHue(baseColor, 180), 0.3),
    rotateHue(baseColor, 180)
  ];
};

const generateTriadic = (baseColor: string): string[] => {
  return [
    baseColor,
    rotateHue(baseColor, 120),
    rotateHue(baseColor, 240)
  ];
};

const generateMonochromatic = (baseColor: string): string[] => {
  const base = colord(baseColor);
  return [
    darken(baseColor, 0.2),
    baseColor,
    lighten(baseColor, 0.2),
    lighten(baseColor, 0.4)
  ];
};

const generateSplitComplementary = (baseColor: string): string[] => {
  return [
    baseColor,
    rotateHue(baseColor, 150),
    rotateHue(baseColor, 210)
  ];
};

const generateTetradic = (baseColor: string): string[] => {
  return [
    baseColor,
    rotateHue(baseColor, 90),
    rotateHue(baseColor, 180),
    rotateHue(baseColor, 270)
  ];
};

const generateVibrant = (baseColor: string): string[] => {
  return [
    saturate(baseColor, 0.3),
    saturate(rotateHue(baseColor, 45), 0.3),
    saturate(rotateHue(baseColor, 90), 0.3)
  ];
};

const generatePastel = (baseColor: string): string[] => {
  return [
    desaturate(lighten(baseColor, 0.3), 0.3),
    desaturate(lighten(rotateHue(baseColor, 30), 0.3), 0.3),
    desaturate(lighten(rotateHue(baseColor, 60), 0.3), 0.3)
  ];
};

const generateWarm = (baseColor: string): string[] => {
  const warm = colord(baseColor).hue() < 60 || colord(baseColor).hue() > 300 
    ? baseColor 
    : "#FF6B6B";
  return [
    warm,
    rotateHue(warm, 15),
    rotateHue(warm, 30),
    rotateHue(warm, 45)
  ];
};

const generateCool = (baseColor: string): string[] => {
  const cool = colord(baseColor).hue() > 180 && colord(baseColor).hue() < 300
    ? baseColor
    : "#4ECDC4";
  return [
    cool,
    rotateHue(cool, 15),
    rotateHue(cool, 30)
  ];
};

const generateEarthy = (baseColor: string): string[] => {
  return [
    desaturate(darken(baseColor, 0.1), 0.4),
    desaturate(baseColor, 0.3),
    desaturate(lighten(baseColor, 0.1), 0.2)
  ];
};

// Main gradient generator using color theory
export const generateGradients = async (baseColor: string, count: number = 8): Promise<GradientPalette[]> => {
  const generators = [
    { type: 'analogous', fn: generateAnalogous },
    { type: 'complementary', fn: generateComplementary },
    { type: 'triadic', fn: generateTriadic },
    { type: 'monochromatic', fn: generateMonochromatic },
    { type: 'splitComplementary', fn: generateSplitComplementary },
    { type: 'vibrant', fn: generateVibrant },
    { type: 'pastel', fn: generatePastel },
    { type: 'warm', fn: generateWarm },
    { type: 'cool', fn: generateCool },
    { type: 'earthy', fn: generateEarthy },
    { type: 'tetradic', fn: generateTetradic }
  ];

  const palettes: GradientPalette[] = [];
  
  // Shuffle generators for variety
  const shuffled = [...generators].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const { type, fn } = shuffled[i];
    const colors = fn(baseColor).slice(0, 3 + Math.floor(Math.random() * 2)); // 3-4 colors
    
    palettes.push({
      name: generateName(type, baseColor),
      description: `A ${type} palette featuring ${descriptors[type as keyof typeof descriptors]}`,
      colors: colors,
      direction: directions[Math.floor(Math.random() * directions.length)]
    });
  }

  // If we need more palettes, create variations
  while (palettes.length < count) {
    const { type, fn } = shuffled[palettes.length % shuffled.length];
    const variation = Math.random() > 0.5 
      ? rotateHue(baseColor, Math.random() * 30 - 15)
      : baseColor;
    const colors = fn(variation).slice(0, 3 + Math.floor(Math.random() * 2));
    
    palettes.push({
      name: generateName(type, variation),
      description: `A ${type} variation with ${descriptors[type as keyof typeof descriptors]}`,
      colors: colors,
      direction: directions[Math.floor(Math.random() * directions.length)]
    });
  }

  return palettes;
};

export const generateCustomPalettes = async (options: CustomGenerationOptions): Promise<GradientPalette[]> => {
  const { baseColor, mood, topic, count } = options;
  
  // Map mood to color adjustments
  const moodMap: Record<string, (color: string) => string[]> = {
    'energetic': generateVibrant,
    'calm': generateCool,
    'warm': generateWarm,
    'professional': (c) => [desaturate(c, 0.2), desaturate(rotateHue(c, 30), 0.2), desaturate(rotateHue(c, 60), 0.2)],
    'playful': (c) => [saturate(c, 0.3), saturate(rotateHue(c, 120), 0.3), saturate(rotateHue(c, 240), 0.3)],
    'elegant': (c) => generateMonochromatic(desaturate(c, 0.3)),
    'bold': (c) => [saturate(c, 0.4), saturate(rotateHue(c, 180), 0.4)],
    'subtle': generatePastel,
    'natural': generateEarthy,
    'modern': (c) => [c, desaturate(rotateHue(c, 90), 0.1), desaturate(rotateHue(c, 180), 0.1)]
  };

  // Select generator based on mood
  const generator = moodMap[mood.toLowerCase()] || generateAnalogous;
  const palettes: GradientPalette[] = [];

  for (let i = 0; i < count; i++) {
    const variation = i === 0 ? baseColor : rotateHue(baseColor, i * (360 / count));
    const colors = generator(variation).slice(0, 2 + Math.floor(Math.random() * 3)); // 2-4 colors
    
    palettes.push({
      name: `${topic} ${mood} ${i + 1}`,
      description: `A ${mood} palette designed for ${topic}`,
      colors: colors,
      direction: directions[Math.floor(Math.random() * directions.length)]
    });
  }

  return palettes;
};

export const generateCuratedPalettes = async (): Promise<GradientPalette[]> => {
  // Curated base colors for variety
  const curatedBases = [
    { color: '#6366F1', theme: 'Modern' },
    { color: '#EC4899', theme: 'Vibrant' },
    { color: '#10B981', theme: 'Fresh' },
    { color: '#F59E0B', theme: 'Warm' },
    { color: '#8B5CF6', theme: 'Royal' },
    { color: '#06B6D4', theme: 'Cool' },
    { color: '#EF4444', theme: 'Bold' },
    { color: '#14B8A6', theme: 'Teal' },
    { color: '#F97316', theme: 'Sunset' },
    { color: '#A78BFA', theme: 'Pastel' },
    { color: '#84CC16', theme: 'Nature' },
    { color: '#F43F5E', theme: 'Rose' }
  ];

  const palettes: GradientPalette[] = [];
  const allGenerators = [
    { type: 'analogous', fn: generateAnalogous },
    { type: 'complementary', fn: generateComplementary },
    { type: 'triadic', fn: generateTriadic },
    { type: 'monochromatic', fn: generateMonochromatic },
    { type: 'vibrant', fn: generateVibrant },
    { type: 'pastel', fn: generatePastel },
    { type: 'warm', fn: generateWarm },
    { type: 'cool', fn: generateCool },
    { type: 'earthy', fn: generateEarthy },
    { type: 'splitComplementary', fn: generateSplitComplementary },
    { type: 'tetradic', fn: generateTetradic }
  ];

  curatedBases.forEach(({ color, theme }, index) => {
    const { type, fn } = allGenerators[index % allGenerators.length];
    const colors = fn(color).slice(0, 3 + Math.floor(Math.random() * 2));
    
    palettes.push({
      name: `${theme} ${paletteNames[type as keyof typeof paletteNames][0]}`,
      description: `${theme} themed gradient with ${descriptors[type as keyof typeof descriptors]}`,
      colors: colors,
      direction: directions[Math.floor(Math.random() * directions.length)]
    });
  });

  return palettes;
};

export const sendMessageToBot = async (message: string): Promise<string> => {
  const lowerMessage = message.toLowerCase();
  
  // Simple rule-based responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm ColourCloud's color theory assistant. I can help you understand color harmonies, choosing palettes, and color psychology. What would you like to know?";
  }
  
  if (lowerMessage.includes('complementary')) {
    return "Complementary colors are opposite each other on the color wheel. They create strong contrast and work great for making elements stand out. For example: blue (#0000FF) and orange (#FFA500).";
  }
  
  if (lowerMessage.includes('analogous')) {
    return "Analogous colors sit next to each other on the color wheel. They create harmonious, pleasing combinations. Perfect for backgrounds and cohesive designs!";
  }
  
  if (lowerMessage.includes('warm') || lowerMessage.includes('cozy')) {
    return "Warm colors (reds, oranges, yellows) create feelings of energy, warmth, and excitement. Great for CTAs, food brands, and energetic designs. Try: #FF6B6B, #FFA500, #FFD700";
  }
  
  if (lowerMessage.includes('cool') || lowerMessage.includes('calm')) {
    return "Cool colors (blues, greens, purples) evoke calmness, trust, and professionalism. Perfect for tech, healthcare, and finance. Try: #4ECDC4, #3B82F6, #8B5CF6";
  }
  
  if (lowerMessage.includes('professional') || lowerMessage.includes('business')) {
    return "For professional designs, use desaturated blues and grays with subtle accents. Monochromatic schemes work well. Try neutral bases like #334155 with blue accents like #3B82F6.";
  }
  
  if (lowerMessage.includes('pastel')) {
    return "Pastels are light, desaturated colors that feel soft and gentle. Great for feminine brands, wellness, and approachable designs. Add white to your base colors!";
  }
  
  if (lowerMessage.includes('contrast') || lowerMessage.includes('accessible')) {
    return "For accessibility, ensure text has at least 4.5:1 contrast ratio with backgrounds (WCAG AA). Use tools like WebAIM's contrast checker. Dark text on light backgrounds or vice versa works best.";
  }
  
  if (lowerMessage.includes('gradient') || lowerMessage.includes('blend')) {
    return "Beautiful gradients use 2-4 colors that share similar saturation and brightness levels. Analogous colors blend smoothly, while complementary colors create vibrant transitions!";
  }
  
  // Default response
  return "That's an interesting question! Color theory includes concepts like complementary colors, analogous harmonies, warm/cool tones, and color psychology. Try asking about a specific color concept, or tell me about your project!";
};