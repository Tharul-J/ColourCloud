import React, { useState } from 'react';
import { GradientPalette } from '../types';
import { CopyIcon, CheckIcon, ArrowLeftIcon, DownloadIcon } from './Icons';
import { exportGradientAsImage } from '../services/imageExportService';

interface DetailViewProps {
  palette: GradientPalette;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ palette, onBack }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const gradientStyle = {
    background: `linear-gradient(${palette.direction || 'to right'}, ${palette.colors.join(', ')})`,
  };

  const cssString = `background: linear-gradient(${palette.direction || 'to right'}, ${palette.colors.join(', ')});`;
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Large Gradient Preview */}
        <div 
          className="w-full h-96 rounded-3xl shadow-2xl mb-8 relative overflow-hidden"
          style={gradientStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Palette Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{palette.name}</h1>
              <p className="text-lg text-slate-600">{palette.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopy(cssString, 'css')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {copied === 'css' ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-5 h-5" />
                    Copy CSS
                  </>
                )}
              </button>
              <button
                onClick={() => exportGradientAsImage(palette)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Download as PNG image (1080x1080)"
              >
                <DownloadIcon className="w-5 h-5" />
                Download PNG
              </button>
            </div>
          </div>

          {/* Gradient Direction */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-500 font-medium mb-1">GRADIENT DIRECTION</p>
            <p className="text-lg font-mono text-slate-900">{palette.direction || 'to right'}</p>
          </div>

          {/* CSS Code Block */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 font-medium mb-3">CSS CODE</p>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                <code>{cssString}</code>
              </pre>
              <button
                onClick={() => handleCopy(cssString, 'css-block')}
                className="absolute top-4 right-4 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
              >
                {copied === 'css-block' ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Color Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Color Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palette.colors.map((color, idx) => (
              <div 
                key={`${color}-${idx}`}
                className="group relative bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-2 border-slate-200 hover:border-indigo-400"
              >
                {/* Large Color Swatch */}
                <div 
                  className="w-full h-32 rounded-lg shadow-md mb-4 border-4 border-white ring-2 ring-slate-200 group-hover:ring-indigo-400 transition-all"
                  style={{ backgroundColor: color }}
                />
                
                {/* Color Code */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">HEX CODE</p>
                    <button
                      onClick={() => handleCopy(color, `hex-${idx}`)}
                      className="w-full bg-white hover:bg-slate-100 border border-slate-300 rounded-lg px-4 py-3 text-left font-mono text-lg font-semibold text-slate-900 transition-colors flex items-center justify-between"
                    >
                      <span>{color.toUpperCase()}</span>
                      {copied === `hex-${idx}` ? (
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <CopyIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                      )}
                    </button>
                  </div>

                  {/* RGB */}
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">RGB</p>
                    <button
                      onClick={() => {
                        const rgb = hexToRgb(color);
                        handleCopy(rgb, `rgb-${idx}`);
                      }}
                      className="w-full bg-white hover:bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-left font-mono text-sm text-slate-700 transition-colors flex items-center justify-between"
                    >
                      <span>{hexToRgb(color)}</span>
                      {copied === `rgb-${idx}` ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <CopyIcon className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>

                  {/* HSL */}
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">HSL</p>
                    <button
                      onClick={() => {
                        const hsl = hexToHsl(color);
                        handleCopy(hsl, `hsl-${idx}`);
                      }}
                      className="w-full bg-white hover:bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-left font-mono text-sm text-slate-700 transition-colors flex items-center justify-between"
                    >
                      <span>{hexToHsl(color)}</span>
                      {copied === `hsl-${idx}` ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <CopyIcon className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'Invalid';
  return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
};

const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'Invalid';
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export default DetailView;
