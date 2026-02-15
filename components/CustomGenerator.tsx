import React, { useState } from 'react';
import { generateCustomPalettes } from '../services/geminiService';
import { GradientPalette } from '../types';
import GradientCard from './GradientCard';
import { RefreshIcon } from './Icons';

const MOODS = [
  "Any", "Vibrant", "Pastel", "Dark Mode", "Minimalist", 
  "Retro", "Neon", "Corporate", "Nature", "Luxury"
];

const CustomGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [mood, setMood] = useState('Any');
  const [topic, setTopic] = useState('');
  const [palettes, setPalettes] = useState<GradientPalette[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setPalettes([]);

    try {
      const data = await generateCustomPalettes({
        baseColor,
        mood,
        topic: topic.trim() || "General Design",
        count: 8
      });
      setPalettes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate custom palettes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Design Your Palette</h2>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Base Color Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Base Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Mood Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Mood / Style</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            >
              {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Topic Input */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Topic or Context (Optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Coffee Shop App, Yoga Studio, Finance Dashboard"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshIcon className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Custom Palette'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      )}

      {!loading && palettes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {palettes.map((palette, index) => (
            <GradientCard key={`${palette.name}-${index}`} palette={palette} />
          ))}
        </div>
      )}

      {!loading && palettes.length === 0 && !error && (
        <div className="text-center py-12 text-slate-400">
          Configure your preferences above and hit Generate!
        </div>
      )}
    </div>
  );
};

export default CustomGenerator;