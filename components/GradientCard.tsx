import React, { useState } from 'react';
import { GradientPalette } from '../types';
import { CopyIcon, CheckIcon, ListIcon } from './Icons';

interface GradientCardProps {
  palette: GradientPalette;
}

const GradientCard: React.FC<GradientCardProps> = ({ palette }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const gradientStyle = {
    background: `linear-gradient(${palette.direction || 'to right'}, ${palette.colors.join(', ')})`,
  };

  const cssString = `background: linear-gradient(${palette.direction || 'to right'}, ${palette.colors.join(', ')});`;
  
  const infoString = `${palette.name}\n${palette.colors.join(', ')}`;

  const handleCopy = (text: string, type: 'css' | 'hex' | 'info') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full">
      {/* Gradient Preview Area */}
      <div 
        className="h-48 w-full transition-transform duration-500 group-hover:scale-105"
        style={gradientStyle}
      />
      
      {/* Overlay for Quick Copy Actions on the image */}
      <div className="absolute top-0 left-0 w-full h-48 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <button
          onClick={() => handleCopy(cssString, 'css')}
          className="bg-white/90 hover:bg-white text-slate-800 px-3 py-2 rounded-lg font-medium text-xs shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          title="Copy CSS code"
        >
          {copied === 'css' ? <CheckIcon className="w-3 h-3 text-green-600" /> : <CopyIcon className="w-3 h-3" />}
          {copied === 'css' ? 'Copied' : 'CSS'}
        </button>
        
        <button
          onClick={() => handleCopy(infoString, 'info')}
          className="bg-white/90 hover:bg-white text-slate-800 px-3 py-2 rounded-lg font-medium text-xs shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
          title="Copy Palette Name and Colors"
        >
          {copied === 'info' ? <CheckIcon className="w-3 h-3 text-green-600" /> : <ListIcon className="w-3 h-3" />}
          {copied === 'info' ? 'Copied' : 'Info'}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg">{palette.name}</h3>
        </div>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{palette.description}</p>

        {/* Color Stops */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {palette.colors.map((color, idx) => (
            <button
              key={`${color}-${idx}`}
              onClick={() => handleCopy(color, 'hex')}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 text-xs font-mono text-slate-600 transition-colors"
              title="Click to copy HEX"
            >
              <div 
                className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: color }}
              />
              {color.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Notification Toast (floating inside card) */}
      {copied === 'hex' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded-full shadow-lg animate-fade-in-up">
          HEX Copied!
        </div>
      )}
    </div>
  );
};

export default GradientCard;