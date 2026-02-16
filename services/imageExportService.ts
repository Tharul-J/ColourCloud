import { GradientPalette } from '../types';

// Export gradient as PNG image
export const exportGradientAsImage = (palette: GradientPalette): void => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Canvas not supported');
    return;
  }

  // Canvas dimensions (Instagram post size)
  const width = 1080;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;

  // Draw gradient background
  const gradientHeight = 700;
  const gradient = createCanvasGradient(ctx, palette.colors, palette.direction || 'to right', width, gradientHeight);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, gradientHeight);

  // Draw white info section
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, gradientHeight, width, height - gradientHeight);

  // Draw palette name
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(palette.name, width / 2, gradientHeight + 70);

  // Draw color codes
  const colorBoxSize = 80;
  const colorBoxSpacing = 20;
  const totalWidth = (palette.colors.length * colorBoxSize) + ((palette.colors.length - 1) * colorBoxSpacing);
  const startX = (width - totalWidth) / 2;
  const startY = gradientHeight + 120;

  palette.colors.forEach((color, index) => {
    const x = startX + (index * (colorBoxSize + colorBoxSpacing));
    
    // Draw color box
    ctx.fillStyle = color;
    ctx.fillRect(x, startY, colorBoxSize, colorBoxSize);
    
    // Draw color code
    ctx.fillStyle = '#64748b';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(color.toUpperCase(), x + colorBoxSize / 2, startY + colorBoxSize + 30);
  });

  // Draw watermark
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Created with Colour Cloud', width / 2, height - 40);

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(palette.name)}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
};

// Create gradient for canvas based on CSS gradient direction
const createCanvasGradient = (
  ctx: CanvasRenderingContext2D,
  colors: string[],
  direction: string,
  width: number,
  height: number
): CanvasGradient => {
  let gradient: CanvasGradient;

  // Parse direction and create appropriate gradient
  if (direction.includes('to right') || direction === '90deg') {
    gradient = ctx.createLinearGradient(0, 0, width, 0);
  } else if (direction.includes('to left') || direction === '270deg' || direction === '-90deg') {
    gradient = ctx.createLinearGradient(width, 0, 0, 0);
  } else if (direction.includes('to bottom') || direction === '180deg') {
    gradient = ctx.createLinearGradient(0, 0, 0, height);
  } else if (direction.includes('to top') || direction === '0deg') {
    gradient = ctx.createLinearGradient(0, height, 0, 0);
  } else if (direction.includes('to bottom right') || direction === '135deg') {
    gradient = ctx.createLinearGradient(0, 0, width, height);
  } else if (direction.includes('to bottom left') || direction === '225deg') {
    gradient = ctx.createLinearGradient(width, 0, 0, height);
  } else if (direction.includes('to top right') || direction === '45deg') {
    gradient = ctx.createLinearGradient(0, height, width, 0);
  } else if (direction.includes('to top left') || direction === '315deg') {
    gradient = ctx.createLinearGradient(width, height, 0, 0);
  } else {
    // Default to right
    gradient = ctx.createLinearGradient(0, 0, width, 0);
  }

  // Add color stops
  const step = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });

  return gradient;
};

// Sanitize filename for download
const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};
