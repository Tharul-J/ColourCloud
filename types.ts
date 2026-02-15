export interface GradientPalette {
  name: string;
  description: string;
  colors: string[]; // Array of hex codes
  direction?: string; // e.g., "to right", "to bottom right"
}

export interface GeneratorState {
  loading: boolean;
  error: string | null;
  data: GradientPalette[] | null;
}

export interface CustomGenerationOptions {
  baseColor: string;
  mood: string;
  topic: string;
  count: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ViewMode = 'home' | 'custom' | 'inspiration' | 'bot';