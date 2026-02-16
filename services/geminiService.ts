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

// Get random element from array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Golden ratio for harmonious spacing
const GOLDEN_RATIO = 1.618033988749895;

// Professional color enhancement
const enhanceColor = (color: string): string => {
  const col = colord(color);
  const hsl = col.toHsl();
  
  // Optimize saturation for better visual appeal
  if (hsl.s < 0.15) {
    return saturate(color, 0.1);
  } else if (hsl.s > 0.9) {
    return desaturate(color, 0.05);
  }
  return color;
};

// Create smooth transition between colors
const createTransition = (color1: string, color2: string, steps: number = 2): string[] => {
  const result: string[] = [color1];
  for (let i = 1; i < steps; i++) {
    result.push(mix(color1, color2, i / steps));
  }
  result.push(color2);
  return result;
};

// Balance brightness across palette
const balanceBrightness = (colors: string[]): string[] => {
  return colors.map((color, i) => {
    const col = colord(color);
    const brightness = col.brightness();
    
    // Create depth by varying brightness
    if (i === 0 && brightness > 0.6) return darken(color, 0.08);
    if (i === colors.length - 1 && brightness < 0.5) return lighten(color, 0.12);
    
    return color;
  });
};

// Add luminance variation for depth
const addDepth = (color: string, variation: 'lighter' | 'darker' | 'vivid'): string => {
  switch(variation) {
    case 'lighter':
      return lighten(saturate(color, 0.05), randomRange(0.12, 0.18));
    case 'darker':
      return darken(saturate(color, 0.08), randomRange(0.1, 0.15));
    case 'vivid':
      return saturate(color, randomRange(0.15, 0.25));
    default:
      return color;
  }
};

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

// Enhanced palette name generators with more variety
const paletteNames = {
  analogous: ["Harmony", "Flow", "Cascade", "Melody", "Symphony", "Rhythm", "Breeze", "Silk Road", "Gentle Waves", "Morning Bloom"],
  complementary: ["Contrast", "Balance", "Duality", "Eclipse", "Fusion", "Unity", "Equilibrium", "Day & Night", "Fire & Ice", "Yin Yang"],
  triadic: ["Trinity", "Triad", "Triangle", "Spectrum", "Prism", "Rainbow", "Kaleidoscope", "Trifecta", "Triple Crown", "Three Muses"],
  monochromatic: ["Gradient", "Fade", "Depth", "Layers", "Shades", "Tones", "Nuance", "Ombre", "Spectrum", "Gradient Flow"],
  splitComplementary: ["Split", "Diverge", "Branch", "Fork", "Divide", "Harmony Plus", "Three Ways", "Trident", "Split Path"],
  tetradic: ["Square", "Quartet", "Four Corners", "Cross", "Quad", "Four Seasons", "Cardinal", "Compass", "Four Elements"],
  vibrant: ["Energy", "Vibrant", "Bold", "Vivid", "Electric", "Neon", "Pop", "Burst", "Explosion", "Pulse", "Lightning"],
  pastel: ["Soft", "Gentle", "Whisper", "Dream", "Cloud", "Silk", "Powder", "Cotton Candy", "Marshmallow", "Serenity"],
  warm: ["Sunset", "Autumn", "Fire", "Warmth", "Copper", "Amber", "Glow", "Golden Hour", "Ember", "Cinnamon", "Spice"],
  cool: ["Ocean", "Ice", "Winter", "Frost", "Arctic", "Azure", "Chill", "Crystal", "Glacier", "Mint", "Breeze"],
  earthy: ["Nature", "Earth", "Forest", "Terra", "Wood", "Stone", "Clay", "Moss", "Sage", "Terracotta", "Bark"]
};

const descriptors = {
  analogous: ["harmonious colors flowing seamlessly", "neighboring hues creating unity", "smooth color transitions"],
  complementary: ["bold contrast with opposite hues", "dynamic tension and balance", "striking opposites that attract"],
  triadic: ["balanced trio of evenly spaced colors", "three-way color harmony", "triangular color relationship"],
  monochromatic: ["elegant variations of a single hue", "tonal depth and sophistication", "shades dancing together"],
  splitComplementary: ["sophisticated three-color harmony", "refined complementary approach", "balanced contrast with flair"],
  tetradic: ["rich four-color combination", "square harmony on color wheel", "complex yet balanced palette"],
  vibrant: ["energetic and saturated tones", "bold, attention-grabbing colors", "vivid hues bursting with life"],
  pastel: ["soft and calming shades", "gentle, approachable colors", "delicate tints with subtle charm"],
  warm: ["cozy and inviting warmth", "sunset-inspired hues", "embracing, comfortable tones"],
  cool: ["refreshing and calm vibes", "serene, trustworthy colors", "crisp, professional atmosphere"],
  earthy: ["grounded natural tones", "organic, nature-inspired palette", "earthy, authentic colors"]
};

// Generate creative palette name
const generateName = (type: string, baseColor: string): string => {
  const colorObj = colord(baseColor);
  const hue = colorObj.hue();
  const saturation = colorObj.toHsl().s;
  const lightness = colorObj.toHsl().l;
  
  // Get base color name or descriptive term
  let colorDesc = colorObj.toName({ closest: true });
  
  // If no name found, use hue-based description
  if (!colorDesc || colorDesc === baseColor) {
    if (hue < 30) colorDesc = "Ruby";
    else if (hue < 60) colorDesc = "Golden";
    else if (hue < 90) colorDesc = "Lime";
    else if (hue < 150) colorDesc = "Emerald";
    else if (hue < 210) colorDesc = "Sapphire";
    else if (hue < 270) colorDesc = "Violet";
    else if (hue < 330) colorDesc = "Magenta";
    else colorDesc = "Crimson";
  }
  
  // Add saturation/lightness modifiers
  if (saturation < 0.2) colorDesc = "Muted " + colorDesc;
  else if (saturation > 0.8) colorDesc = "Vivid " + colorDesc;
  
  if (lightness < 0.3) colorDesc = "Deep " + colorDesc;
  else if (lightness > 0.7) colorDesc = "Soft " + colorDesc;
  
  const names = paletteNames[type as keyof typeof paletteNames] || paletteNames.analogous;
  const name = random(names);
  
  return `${colorDesc} ${name}`;
};

// Enhanced color harmony generators - stay true to base color
const generateAnalogous = (baseColor: string): string[] => {
  const angle1 = randomRange(12, 20);  // Very subtle hue shift
  const angle2 = randomRange(25, 35);  // Moderate shift
  
  const color1 = rotateHue(baseColor, angle1);
  const color2 = rotateHue(baseColor, angle2);
  const color3 = rotateHue(baseColor, -angle1);
  
  const palette = [
    enhanceColor(baseColor),
    addDepth(color1, 'lighter'),
    enhanceColor(color2),
    addDepth(color3, 'darker')
  ];
  
  return balanceBrightness(palette);
};

const generateComplementary = (baseColor: string): string[] => {
  const complement = rotateHue(baseColor, 180);
  
  // Create a beautiful bridge between base and complement
  const bridge1 = mix(baseColor, complement, 0.15);
  const bridge2 = mix(baseColor, complement, 0.35);
  const accentComplement = addDepth(complement, 'vivid');
  
  const palette = [
    enhanceColor(baseColor),
    addDepth(bridge1, 'lighter'),
    enhanceColor(bridge2),
    accentComplement
  ];
  
  return balanceBrightness(palette);
};

const generateTriadic = (baseColor: string): string[] => {
  const color2 = rotateHue(baseColor, 120);
  const color3 = rotateHue(baseColor, 240);
  
  // Use golden ratio for sophisticated blends
  const goldenMix = 1 / GOLDEN_RATIO; // ~0.618
  const blend1 = mix(baseColor, color2, goldenMix * 0.3);
  const blend2 = mix(baseColor, color3, goldenMix * 0.25);
  
  const palette = [
    enhanceColor(baseColor),
    addDepth(blend1, 'lighter'),
    addDepth(blend2, 'vivid'),
    enhanceColor(mix(color2, color3, 0.5))
  ];
  
  return balanceBrightness(palette);
};

const generateMonochromatic = (baseColor: string): string[] => {
  const col = colord(baseColor);
  const hsl = col.toHsl();
  
  // Create dramatic range while staying in same hue
  const darkVersion = darken(saturate(baseColor, 0.1), randomRange(0.2, 0.3));
  const lightVersion = lighten(desaturate(baseColor, 0.05), randomRange(0.2, 0.3));
  const vividVersion = saturate(baseColor, randomRange(0.2, 0.35));
  
  const palette = [
    darkVersion,
    enhanceColor(baseColor),
    vividVersion,
    lightVersion
  ];
  
  return balanceBrightness(palette);
};

const generateSplitComplementary = (baseColor: string): string[] => {
  const angle1 = 150;
  const angle2 = 210;
  
  // Create sophisticated split harmony
  const split1 = rotateHue(baseColor, angle1);
  const split2 = rotateHue(baseColor, angle2);
  const blend = mix(split1, split2, 0.5);
  
  const palette = [
    enhanceColor(baseColor),
    addDepth(baseColor, 'lighter'),
    mix(baseColor, split1, 0.2),
    mix(baseColor, split2, 0.2)
  ];
  
  return balanceBrightness(palette);
};

const generateTetradic = (baseColor: string): string[] => {
  const color2 = rotateHue(baseColor, 90);
  const color3 = rotateHue(baseColor, 180);
  const color4 = rotateHue(baseColor, 270);
  
  // Four-way harmony with controlled blending
  const palette = [
    enhanceColor(baseColor),
    addDepth(mix(baseColor, color2, 0.25), 'lighter'),
    mix(baseColor, color3, 0.3),
    addDepth(mix(baseColor, color4, 0.25), 'vivid')
  ];
  
  return balanceBrightness(palette);
};

const generateVibrant = (baseColor: string): string[] => {
  const angle1 = randomRange(18, 28);
  const angle2 = randomRange(35, 45);
  
  // Maximum visual impact while staying in color family
  const electric1 = saturate(lighten(rotateHue(baseColor, angle1), 0.1), 0.35);
  const electric2 = saturate(rotateHue(baseColor, angle2), 0.4);
  const electric3 = saturate(darken(rotateHue(baseColor, -angle1), 0.05), 0.3);
  
  const palette = [
    addDepth(baseColor, 'vivid'),
    electric1,
    electric2,
    electric3
  ];
  
  return balanceBrightness(palette);
};

const generatePastel = (baseColor: string): string[] => {
  const angle1 = randomRange(15, 22);
  const angle2 = randomRange(8, 15);
  
  // Create ethereal, light palette
  const soft1 = lighten(desaturate(baseColor, 0.35), 0.32);
  const soft2 = lighten(desaturate(rotateHue(baseColor, angle1), 0.3), 0.28);
  const soft3 = lighten(desaturate(rotateHue(baseColor, -angle2), 0.32), 0.3);
  const softBase = lighten(desaturate(baseColor, 0.25), 0.15);
  
  const palette = [
    softBase,
    soft1,
    soft2,
    soft3
  ];
  
  return balanceBrightness(palette);
};

const generateWarm = (baseColor: string): string[] => {
  const hue = colord(baseColor).hue();
  
  // If already warm (red-orange-yellow range), enhance it
  if (hue < 60 || hue > 300) {
    const warm1 = addDepth(saturate(rotateHue(baseColor, randomRange(8, 15)), 0.15), 'lighter');
    const warm2 = saturate(baseColor, randomRange(0.15, 0.25));
    const warm3 = addDepth(rotateHue(baseColor, randomRange(-8, -15)), 'darker');
    
    return balanceBrightness([enhanceColor(baseColor), warm1, warm2, warm3]);
  }
  
  // If not warm, shift toward warm hues but stay close
  const warmShift = hue > 180 ? randomRange(-30, -15) : randomRange(15, 30);
  const warmed = rotateHue(baseColor, warmShift);
  const transition = createTransition(baseColor, warmed, 2);
  
  return balanceBrightness([enhanceColor(baseColor), ...transition.slice(1)]);
};

const generateCool = (baseColor: string): string[] => {
  const hue = colord(baseColor).hue();
  
  // If already cool (cyan-blue-purple range), enhance it
  if (hue > 180 && hue < 300) {
    const cool1 = addDepth(saturate(rotateHue(baseColor, randomRange(10, 18)), 0.15), 'lighter');
    const cool2 = saturate(lighten(baseColor, 0.08), randomRange(0.15, 0.25));
    const cool3 = addDepth(rotateHue(baseColor, randomRange(-10, -18)), 'darker');
    
    return balanceBrightness([enhanceColor(baseColor), cool1, cool2, cool3]);
  }
  
  // If not cool, shift toward cool hues but stay close
  const coolShift = hue < 90 ? randomRange(25, 35) : randomRange(-25, -35);
  const cooled = rotateHue(baseColor, coolShift);
  const transition = createTransition(baseColor, cooled, 2);
  
  return balanceBrightness([enhanceColor(baseColor), ...transition.slice(1)]);
};

const generateEarthy = (baseColor: string): string[] => {
  const angle1 = randomRange(12, 20);
  const angle2 = randomRange(8, 15);
  
  // Create grounded, natural palette
  const earth1 = darken(desaturate(baseColor, 0.38), 0.18);
  const earth2 = darken(desaturate(rotateHue(baseColor, angle1), 0.35), 0.15);
  const earth3 = desaturate(rotateHue(baseColor, -angle2), 0.4);
  const earthBase = desaturate(baseColor, 0.25);
  
  const palette = [
    earthBase,
    earth1,
    earth2,
    earth3
  ];
  
  return balanceBrightness(palette);
};

// Main gradient generator using color theory
export const generateGradients = async (baseColor: string, count: number = 8): Promise<GradientPalette[]> => {
  const generators = [
    { type: 'analogous', fn: generateAnalogous },
    { type: 'monochromatic', fn: generateMonochromatic },
    { type: 'complementary', fn: generateComplementary },
    { type: 'vibrant', fn: generateVibrant },
    { type: 'pastel', fn: generatePastel },
    { type: 'triadic', fn: generateTriadic },
    { type: 'warm', fn: generateWarm },
    { type: 'cool', fn: generateCool },
    { type: 'earthy', fn: generateEarthy },
    { type: 'splitComplementary', fn: generateSplitComplementary },
    { type: 'tetradic', fn: generateTetradic }
  ];

  const palettes: GradientPalette[] = [];
  
  // Shuffle generators for variety
  const shuffled = [...generators].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const { type, fn } = shuffled[i];
    const colors = fn(baseColor);
    
    // Use 3-4 colors for better visual cohesion
    const colorCount = Math.floor(Math.random() * 2) + 3; // 3 or 4 colors
    const selectedColors = colors.slice(0, colorCount);
    
    palettes.push({
      name: generateName(type, baseColor),
      description: `A ${type} palette featuring ${random(descriptors[type as keyof typeof descriptors])}`,
      colors: selectedColors,
      direction: random(directions)
    });
  }

  // If we need more palettes, create subtle variations of existing ones
  while (palettes.length < count) {
    const { type, fn } = shuffled[palettes.length % shuffled.length];
    
    // Create subtle variation: slightly adjust lightness of base color
    const variation = Math.random() > 0.5 
      ? lighten(baseColor, randomRange(0.03, 0.08))
      : darken(baseColor, randomRange(0.03, 0.08));
    
    const colors = fn(variation);
    const colorCount = Math.floor(Math.random() * 2) + 3;
    
    palettes.push({
      name: generateName(type, variation),
      description: `A ${type} variation with ${random(descriptors[type as keyof typeof descriptors])}`,
      colors: colors.slice(0, colorCount),
      direction: random(directions)
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
  // Curated base colors for variety - with MORE diverse starting points
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

  // Shuffle for randomness each time
  const shuffledGenerators = [...allGenerators].sort(() => Math.random() - 0.5);
  const shuffledBases = [...curatedBases].sort(() => Math.random() - 0.5);

  shuffledBases.forEach(({ color, theme }, index) => {
    // Apply RANDOM variation to base color each time for inspiration
    const variation = Math.random() > 0.5 
      ? lighten(color, randomRange(0.05, 0.15))
      : darken(color,  randomRange(0.05, 0.15));
    
    // Sometimes rotate hue slightly for more variety
    const finalColor = Math.random() > 0.6 
      ? rotateHue(variation, randomRange(-20, 20))
      : variation;
    
    const { type, fn } = shuffledGenerators[index % shuffledGenerators.length];
    const colors = fn(finalColor);
    
    // Vary color count for visual diversity (3-5 colors)
    const colorCount = 3 + Math.floor(Math.random() * 3);
    const selectedColors = colors.slice(0, colorCount);
    
    palettes.push({
      name: generateName(type, finalColor),
      description: `${theme} themed gradient with ${random(descriptors[type as keyof typeof descriptors])}`,
      colors: selectedColors,
      direction: random(directions)
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