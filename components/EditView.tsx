import React, { useState } from 'react';
import { GradientPalette } from '../types';
import { ArrowLeftIcon, SaveIcon, XIcon, PlusIcon, TrashIcon, GripVerticalIcon } from './Icons';
import { colord } from 'colord';

interface EditViewProps {
  palette: GradientPalette;
  onSave: (editedPalette: GradientPalette) => void;
  onCancel: () => void;
}

const EditView: React.FC<EditViewProps> = ({ palette, onSave, onCancel }) => {
  const [name, setName] = useState(palette.name);
  const [description, setDescription] = useState(palette.description);
  const [colors, setColors] = useState([...palette.colors]);
  const [direction, setDirection] = useState(palette.direction || 'to right');

  const gradientStyle = {
    background: `linear-gradient(${direction}, ${colors.join(', ')})`,
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    // Validate hex color
    try {
      const validColor = colord(newColor).toHex();
      updatedColors[index] = validColor;
      setColors(updatedColors);
    } catch (e) {
      // Invalid color, ignore
    }
  };

  const handleMoveColor = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === colors.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedColors = [...colors];
    [updatedColors[index], updatedColors[newIndex]] = [
      updatedColors[newIndex],
      updatedColors[index],
    ];
    setColors(updatedColors);
  };

  const handleAddColor = () => {
    if (colors.length < 10) {
      // Generate a color that fits with the palette
      const newColor = colord(colors[colors.length - 1])
        .rotate(30)
        .toHex();
      setColors([...colors, newColor]);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 2) {
      const updatedColors = colors.filter((_, i) => i !== index);
      setColors(updatedColors);
    }
  };

  const handleSave = () => {
    const editedPalette: GradientPalette = {
      name,
      description,
      colors,
      direction,
    };
    onSave(editedPalette);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Cancel</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-200 flex items-center gap-2"
              >
                <XIcon className="w-4 h-4" />
                Discard
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <SaveIcon className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Live Gradient Preview */}
        <div 
          className="w-full h-96 rounded-3xl shadow-2xl mb-8 relative overflow-hidden transition-all duration-300"
          style={gradientStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-sm text-slate-600 font-medium">Live Preview</p>
              <p className="text-xs text-slate-500 mt-1">Changes update in real-time</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Name & Description */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Palette Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-900 font-medium text-lg transition-colors"
              placeholder="Enter palette name..."
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-600 resize-none transition-colors"
              rows={3}
              placeholder="Describe this palette..."
            />
          </div>

          {/* Gradient Direction */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Gradient Direction
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'to right', label: 'Left → Right' },
                { value: 'to left', label: 'Right → Left' },
                { value: 'to bottom', label: 'Top → Bottom' },
                { value: 'to top', label: 'Bottom → Top' },
                { value: 'to bottom right', label: '↘ Diagonal' },
                { value: 'to bottom left', label: '↙ Diagonal' },
                { value: 'to top right', label: '↗ Diagonal' },
                { value: 'to top left', label: '↖ Diagonal' },
              ].map((dir) => (
                <button
                  key={dir.value}
                  onClick={() => setDirection(dir.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    direction === dir.value
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Editor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-700">
                Colors ({colors.length})
              </label>
              <button
                onClick={handleAddColor}
                disabled={colors.length >= 10}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                title={colors.length >= 10 ? 'Maximum 10 colors' : 'Add a new color'}
              >
                <PlusIcon className="w-4 h-4" />
                Add Color
              </button>
            </div>

            <div className="space-y-3">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                >
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveColor(index, 'up')}
                      disabled={index === 0}
                      className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <GripVerticalIcon className="w-4 h-4 text-slate-400" />
                    <button
                      onClick={() => handleMoveColor(index, 'down')}
                      disabled={index === colors.length - 1}
                      className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Color Preview */}
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border-2 border-white flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />

                  {/* Color Picker */}
                  <div className="flex-1">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer border-2 border-slate-300 hover:border-indigo-500 transition-colors"
                      title="Pick a color"
                    />
                  </div>

                  {/* Hex Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:outline-none text-slate-900 font-mono text-sm uppercase transition-colors"
                      placeholder="#000000"
                      maxLength={7}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveColor(index)}
                    disabled={colors.length <= 2}
                    className="p-3 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    title={colors.length <= 2 ? 'Minimum 2 colors required' : 'Remove color'}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {colors.length >= 10 && (
              <p className="text-sm text-amber-600 mt-3 flex items-center gap-2">
                <span className="font-semibold">Maximum reached:</span>
                <span>You can have up to 10 colors in a gradient.</span>
              </p>
            )}
            {colors.length === 2 && (
              <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                <span className="font-semibold">Minimum required:</span>
                <span>At least 2 colors are needed for a gradient.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditView;
