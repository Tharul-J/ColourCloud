import React from 'react';
import { ViewMode } from '../types';
import { LayoutGridIcon, ChatBubbleIcon, WandIcon } from './Icons';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col transition-all duration-300 z-50">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <WandIcon className="w-8 h-8 text-indigo-400" />
        <span className="hidden lg:block ml-3 font-bold text-white text-lg tracking-tight">ColourClouds</span>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-2 lg:px-4">
        <button
          onClick={() => onViewChange('home')}
          className={`
            flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all
            ${currentView === 'home' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }
          `}
        >
          <LayoutGridIcon className="w-6 h-6" />
          <span className="hidden lg:block ml-3 font-medium">Colors List</span>
        </button>

        <button
          onClick={() => onViewChange('bot')}
          className={`
            flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all
            ${currentView === 'bot' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }
          `}
        >
          <ChatBubbleIcon className="w-6 h-6" />
          <span className="hidden lg:block ml-3 font-medium">Color Bot</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center lg:text-left">
        <span className="hidden lg:inline">Powered by Gemini 3.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;