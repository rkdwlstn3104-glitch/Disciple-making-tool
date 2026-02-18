
import React from 'react';
import { AppMode } from '../types';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: AppMode.CONVERSATION, label: '🗣️ 대화하기' },
    { id: AppMode.PHONE, label: '☎️ 전화봉사' },
    { id: AppMode.TEXT, label: '📱 문자봉사' },
    { id: AppMode.LETTER, label: '✉️ 편지봉사' },
  ];

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap bg-stone-900/50 p-1.5 rounded-2xl gap-2 w-full max-w-2xl mx-auto border border-stone-600/30">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`
            px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex-1 sm:flex-initial text-center
            ${currentMode === mode.id 
              ? 'bg-amber-500 text-white shadow-lg ring-1 ring-amber-400 transform scale-105 z-10' 
              : 'text-stone-400 hover:text-white hover:bg-stone-700/50'
            }
          `}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSwitcher;
