
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-shadow h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-700 flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="hidden sm:inline">제자 삼기 도구 (34선)</span>
          <span className="sm:hidden">대화 도구 (34선)</span>
        </h1>
        
        <div className="flex gap-2">
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-full font-medium border border-stone-200">
                v1.2
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
