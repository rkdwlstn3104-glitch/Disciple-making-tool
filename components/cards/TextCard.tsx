
import React from 'react';
import { CardProps } from '../../types';

interface TextCardProps extends CardProps {
  isCopied: boolean;
}

const TextCard: React.FC<TextCardProps> = ({ item, onCopy, isCopied }) => {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // WOL URL 생성
  const wolUrl = `https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(item.v)}`;

  // 텍스트를 성구 및 jw.org 링크 기준으로 분할하여 렌더링
  const prefix = `${item.ti}\n\n"${cleanQ}"\n\n이 점에 대해 성경 `;
  const middleText = `에서는 이렇게 알려줍니다.\n\n"${item.t}"\n\n${item.tc}\n\n더 많은 정보는 `;
  const jwLink = "jw.org/ko";
  const suffix = ` 를 방문해 보세요.`;
  
  const fullMessageForCopy = `${prefix}${item.v}${middleText}${jwLink}${suffix}`;

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex-grow bg-[#E3F2FD] rounded-2xl rounded-bl-none p-5 shadow-md relative group transition-all duration-300">
        <div className="absolute -left-2 bottom-0 w-4 h-4 bg-[#E3F2FD] transform rotate-45"></div>
        
        <p className="text-stone-800 text-sm sm:text-base whitespace-pre-wrap leading-relaxed break-keep font-medium">
          {prefix}
          <a 
            href={wolUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-bold decoration-2 underline-offset-2 transition-all"
            title="라이브러리에서 성구 보기"
          >
            {item.v}
          </a>
          {middleText}
          <a 
            href="https://www.jw.org/ko" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-bold decoration-2 underline-offset-2 transition-all"
          >
            {jwLink}
          </a>
          {suffix}
        </p>
      </div>
      
      <button 
        onClick={() => onCopy(fullMessageForCopy)}
        className={`
          self-end px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2
          ${isCopied 
            ? 'bg-green-500 text-white shadow-lg' 
            : 'bg-stone-700 text-stone-200 hover:bg-stone-600 hover:text-white'
          }
        `}
      >
        {isCopied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
            복사됨!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            메시지 복사
          </>
        )}
      </button>
    </div>
  );
};

export default TextCard;
