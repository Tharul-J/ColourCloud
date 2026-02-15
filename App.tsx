import React, { useState, useEffect } from 'react';
import { generateGradients, generateCuratedPalettes } from './services/geminiService';
import { GradientPalette, ViewMode } from './types';
import GradientCard from './components/GradientCard';
import SkeletonCard from './components/SkeletonCard';
import { WandIcon, RefreshIcon, PlusIcon, LayoutGridIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [baseColor, setBaseColor] = useState<string>('#6366f1');
  const [palettes, setPalettes] = useState<GradientPalette[]>([]);
  const [inspirationPalettes, setInspirationPalettes] = useState<GradientPalette[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInspo, setLoadingInspo] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('home');

  // Initial load for Home
  useEffect(() => {
    handleGenerate(8);
  }, []);

  // Fetch inspiration on tab switch if empty
  useEffect(() => {
    if (view === 'inspiration' && inspirationPalettes.length === 0) {
      fetchInspiration();
    }
  }, [view]);

  const fetchInspiration = async () => {
    setLoadingInspo(true);
    try {
      const data = await generateCuratedPalettes();
      setInspirationPalettes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInspo(false);
    }
  };

  const handleGenerate = async (count: number = 8) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateGradients(baseColor, count);
      setPalettes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate gradients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = async () => {
    setLoadingMore(true);
    try {
      const data = await generateGradients(baseColor, 16);
      setPalettes(prev => [...prev, ...data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRandomizeColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
  };

  const AnimatedText = ({ text }: { text: string }) => (
    <span className="inline-block whitespace-nowrap">
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="inline-block animate-wave-text hover:text-indigo-200 transition-colors duration-300" 
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );

  // Startup Page
  if (!started) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy animate-hue-cycle">
        {/* Abstract shapes for background depth - using white to take on the hue colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-2 leading-none drop-shadow-2xl">
            <AnimatedText text="COLOUR" /><br/>
            <AnimatedText text="CLOUD" />
          </h1>
          
          <button
            onClick={() => setStarted(true)}
            className="mt-12 group relative px-12 py-4 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white font-bold text-lg tracking-widest rounded-full border border-white/20 hover:border-white/60 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]"
          >
            <span className="relative z-10">EXPLORE</span>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <WandIcon className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-2xl tracking-tight text-slate-800">Colour Cloud</span>
            </div>
            
            <div className="flex space-x-2 sm:space-x-4">
              <button 
                onClick={() => setView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold transition-colors ${view === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <LayoutGridIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <button 
                onClick={() => setView('inspiration')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold transition-colors ${view === 'inspiration' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Inspiration</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* HOME VIEW */}
        {view === 'home' && (
          <>
            <div className="relative overflow-hidden bg-white border-b border-slate-200">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${baseColor} 0%, transparent 70%)`
                }}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 drop-shadow-sm">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Colour Cloud</span>
                </h1>
                <p className="max-w-xl text-lg md:text-xl text-slate-600 mb-10">
                  Instant gradient magic. Pick a color, get inspired.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 max-w-xl w-full">
                  <div className="relative flex items-center flex-1 w-full sm:w-auto px-2">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-12 rounded-full cursor-pointer border-0 p-0 overflow-hidden shadow-sm hover:scale-105 transition-transform"
                    />
                    <input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="ml-4 flex-1 outline-none bg-transparent text-slate-900 font-mono text-xl uppercase placeholder-slate-400 font-bold"
                      placeholder="#000000"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleRandomizeColor}
                      className="p-4 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Random Color"
                    >
                      <RefreshIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleGenerate(8)}
                      disabled={loading}
                      className={`flex-1 sm:flex-none px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5
                        ${loading 
                          ? 'bg-slate-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/30'
                        }
                      `}
                    >
                      {loading ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-center">{error}</div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Generated Palettes</h2>
                    <span className="text-slate-500 text-sm">{palettes.length} Results</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {palettes.map((palette, index) => <GradientCard key={`${palette.name}-${index}`} palette={palette} />)}
                    {loadingMore && [1, 2, 3, 4].map((i) => <SkeletonCard key={`loading-${i}`} />)}
                  </div>
                  {palettes.length > 0 && !loadingMore && (
                    <div className="flex justify-center pb-12">
                      <button
                        onClick={handleSeeMore}
                        className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 px-8 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        See More Matching Colors
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </>
        )}

        {/* INSPIRATION VIEW */}
        {view === 'inspiration' && (
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Curated Inspiration</h1>
                <p className="text-slate-600">Hand-picked styles and trending color combinations from the AI system.</p>
              </div>
              <button 
                onClick={fetchInspiration} 
                disabled={loadingInspo}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                <RefreshIcon className={`w-4 h-4 ${loadingInspo ? 'animate-spin' : ''}`} />
                Refresh List
              </button>
            </div>

            {loadingInspo && inspirationPalettes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inspirationPalettes.map((palette, index) => <GradientCard key={`inspo-${index}`} palette={palette} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Colour Cloud. Created by <a href="https://github.com/Tharul-J" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 font-medium transition-colors">Tharul Jayasundara</a>.
          </p>
          <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;