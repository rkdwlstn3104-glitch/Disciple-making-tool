
import React from 'react';
import { CardProps } from '../../types';

const ConversationCard: React.FC<CardProps> = ({ item }) => {
  const formattedQ = item.q.split('**').map((part, i) => 
    i % 2 === 1 ? <span key={i} className="text-amber-300 font-extrabold">{part}</span> : part
  );

  const wolUrl = `https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(item.v)}`;

  return (
    <div className="bg-stone-800/40 border border-stone-600/50 rounded-2xl p-6 hover:bg-stone-800/60 transition-all duration-300 flex flex-col h-full shadow-lg group">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">🗣️ 질문</span>
            <a 
              href={wolUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded border border-amber-800/50 hover:bg-amber-800 transition-colors flex items-center gap-1"
            >
              {item.v} 🔗
            </a>
        </div>
        <p className="text-lg text-white leading-relaxed break-keep font-medium">"{formattedQ}"</p>
      </div>

      <div className="mb-6 flex-grow">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">💡 진리</span>
        <div className="mt-2 p-4 bg-stone-900/30 rounded-xl border-l-4 border-amber-500">
            <p className="text-stone-200 text-sm leading-relaxed break-keep italic">
              {item.t}
            </p>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-stone-600/50">
        <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.15em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            재방문 질문
        </span>
        <p className="text-amber-100/90 mt-2 font-medium text-sm break-keep leading-relaxed italic">
          "{item.r}"
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;
