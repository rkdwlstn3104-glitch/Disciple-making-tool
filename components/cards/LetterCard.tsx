
import React from 'react';
import { CardProps } from '../../types';

interface LetterCardProps extends CardProps {
  isCopied: boolean;
}

const LetterCard: React.FC<LetterCardProps> = ({ item, onCopy, isCopied }) => {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const wolUrl = `https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(item.v)}`;

  // 편지 내용을 섹션별로 나누어 렌더링 시 링크 삽입
  const introPart = `[수신인 성함] 님께,\n\n안녕하십니까. 저는 이웃에 살고 있는 주민입니다. 직접 뵙고 따뜻한 인사를 나누고 싶었지만, 상황이 여의치 않아 이렇게 편지로 대신 마음을 전합니다.\n\n${item.ti}\n\n최근 저도 깊이 생각해 보게 된 질문이 하나 있는데요, 바로 "${cleanQ}"라는 점입니다. 성경 `;
  
  const midBeforeLink = `에서는 이 질문에 대해 이렇게 알려 줍니다.\n\n"${item.t}"\n\n이 말씀이 님께 큰 희망과 위로가 되기를 바랍니다. ${item.tc}\n\n더 자세한 내용은 저희 웹사이트 `;
  const jwLinkText = "jw.org/ko";
  const midAfterLink = ` 를 방문해 보시기 바랍니다. 또한 원하신다면 웹사이트를 통해 무료 성서 연구를 신청하여 성경에 대해 더 자세히 알아보실 수도 있습니다.\n\n건강하시고 평안한 하루 되십시오.\n\n${dateStr}\n[전도인 이름] 드림`;

  const fullLetterText = `${introPart}${item.v}${midBeforeLink}${jwLinkText}${midAfterLink}`;

  return (
    <div className="bg-[#FFFAF0] rounded-lg shadow-xl p-6 sm:p-10 relative overflow-hidden min-h-[500px] flex flex-col group transition-all duration-300">
      {/* Decorative Lined Paper Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', 
        backgroundSize: '100% 2.8rem',
        marginTop: '4rem'
      }}></div>
      
      <div className="relative z-10 flex-grow">
        <p className="text-stone-800 font-sans text-sm sm:text-base leading-[2.8rem] whitespace-pre-wrap break-keep font-medium">
          {introPart}
          <a 
            href={wolUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-bold underline-offset-4 transition-all"
            title="온라인 라이브러리에서 읽기"
          >
            {item.v}
          </a>
          {midBeforeLink}
          <a 
            href="https://www.jw.org/ko" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline font-bold underline-offset-4 transition-all"
          >
            {jwLinkText}
          </a>
          {midAfterLink}
        </p>
      </div>

      <div className="relative z-10 mt-10 pt-4 border-t border-stone-200 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <span className="text-xs">✉️</span>
          </div>
          <span className="text-[10px] text-stone-500 font-sans font-bold uppercase tracking-wider">주제별 맞춤 편지 초안</span>
        </div>
        <button 
          onClick={() => onCopy(fullLetterText)}
          className={`
            px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95
            ${isCopied ? 'bg-green-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'}
          `}
        >
          {isCopied ? '편지 전체 복사됨' : '편지 내용 전체 복사'}
        </button>
      </div>
    </div>
  );
};

export default LetterCard;
