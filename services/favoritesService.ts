import { GradientPalette } from '../types';

const FAVORITES_KEY = 'colourcloud_favorites';

// Get all favorites from localStorage
export const getFavorites = (): GradientPalette[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavorites = (favorites: GradientPalette[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Add palette to favorites
export const addFavorite = (palette: GradientPalette): void => {
  const favorites = getFavorites();
  
  // Check if already exists (by comparing colors and name)
  const exists = favorites.some(
    fav => fav.name === palette.name && 
           JSON.stringify(fav.colors) === JSON.stringify(palette.colors)
  );
  
  if (!exists) {
    favorites.unshift(palette); // Add to beginning
    saveFavorites(favorites);
  }
};

// Remove palette from favorites
export const removeFavorite = (palette: GradientPalette): void => {
  const favorites = getFavorites();
  const filtered = favorites.filter(
    fav => !(fav.name === palette.name && 
             JSON.stringify(fav.colors) === JSON.stringify(palette.colors))
  );
  saveFavorites(filtered);
};

// Check if palette is favorited
export const isFavorite = (palette: GradientPalette): boolean => {
  const favorites = getFavorites();
  return favorites.some(
    fav => fav.name === palette.name && 
           JSON.stringify(fav.colors) === JSON.stringify(palette.colors)
  );
};

// Clear all favorites
export const clearFavorites = (): void => {
  localStorage.removeItem(FAVORITES_KEY);
};

// Get favorites count
export const getFavoritesCount = (): number => {
  return getFavorites().length;
};
