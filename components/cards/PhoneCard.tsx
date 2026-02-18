
import React from 'react';
import { CardProps } from '../../types';

interface PhoneCardProps extends CardProps {
  isCopied: boolean;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ item, onCopy, isCopied }) => {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  const dialogueQ = cleanQ.replace('혹시', '').replace('알고 계셨나요?', '어떻게 생각하시나요?');
  
  // WOL URL 생성
  const wolUrl = `https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(item.v)}`;

  const scriptHtml = (
    <div className="space-y-4 text-sm leading-relaxed">
      <div>
        <span className="text-emerald-300 font-bold block mb-1">[인사 및 소개]</span>
        <p className="text-stone-300">"안녕하세요, 선생님/여사님. 잠시 통화 괜찮으신가요? 저는 이웃에 거주하며 지역 봉사 활동을 하는 [이름]입니다."</p>
      </div>
      <div>
        <span className="text-emerald-300 font-bold block mb-1">[질문 던지기]</span>
        <p className="text-stone-300">"다름이 아니라, {dialogueQ}"</p>
      </div>
      <div>
        <span className="text-emerald-300 font-bold block mb-1">[성구 및 진리 전달]</span>
        <p className="text-stone-300">
          "네, 많은 분들이 그렇게 말씀하시더라고요. 그런데 성경 
          <a 
            href={wolUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-emerald-400 font-bold hover:underline mx-1 transition-all decoration-2 underline-offset-2"
            title="라이브러리에서 성구 보기"
          >
            {item.v}
          </a>
          에서는 '{item.t}'라고 알려줍니다."
        </p>
      </div>
      <div>
        <span className="text-emerald-300 font-bold block mb-1">[마무리 및 제안]</span>
        <p className="text-stone-300">"이 내용이 마음에 조금이나마 위로가 되셨으면 좋겠습니다. 혹시 이 성경 구절을 문자로 보내드려도 괜찮을까요?"</p>
      </div>
    </div>
  );

  const plainText = `[인사 및 소개]\n"안녕하세요, 선생님. 저는 지역에서 봉사하는 [이름]입니다."\n\n[질문]\n"다름이 아니라, ${dialogueQ}"\n\n[성구 및 진리]\n"성경 ${item.v}에서는 '${item.t}'라고 알려줍니다."\n\n[마무리]\n"이 내용이 위로가 되었으면 좋겠네요. 더 궁금한 점이 있으신가요?"`;

  return (
    <div className="bg-emerald-900/20 border-l-4 border-emerald-500 rounded-2xl p-6 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">☎️ 전화 스크립트</span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">안내 멘트</span>
      </div>
      
      <div className="flex-grow">
        {scriptHtml}
      </div>

      <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-end">
        <button 
          onClick={() => onCopy(plainText)}
          className={`
            px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2
            ${isCopied ? 'bg-emerald-500 text-white' : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-700/60'}
          `}
        >
          {isCopied ? '복사 완료' : '스크립트 복사'}
        </button>
      </div>
    </div>
  );
};

export default PhoneCard;
