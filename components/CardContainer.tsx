
import React from 'react';
import { AppMode, TruthItem } from '../types';
import ConversationCard from './cards/ConversationCard';
import TextCard from './cards/TextCard';
import PhoneCard from './cards/PhoneCard';
import LetterCard from './cards/LetterCard';

interface CardContainerProps {
  mode: AppMode;
  items: TruthItem[];
  onCopy: (text: string) => void;
  copiedText: string | null;
}

const CardContainer: React.FC<CardContainerProps> = ({ mode, items, onCopy, copiedText }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {items.map((item, idx) => {
        const key = `${mode}-${idx}`;
        switch (mode) {
          case AppMode.CONVERSATION:
            return <ConversationCard key={key} item={item} onCopy={onCopy} />;
          case AppMode.TEXT:
            return <TextCard key={key} item={item} onCopy={onCopy} isCopied={copiedText === generateText(item)} />;
          case AppMode.PHONE:
            return <PhoneCard key={key} item={item} onCopy={onCopy} isCopied={copiedText === generatePhoneScript(item)} />;
          case AppMode.LETTER:
            return <LetterCard key={key} item={item} onCopy={onCopy} isCopied={copiedText === generateLetter(item)} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

// Helper formatters
function generateText(item: TruthItem) {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  return `${item.ti}\n\n"${cleanQ}"\n\n이 점에 대해 성경 ${item.v}에서는 이렇게 알려줍니다.\n\n"${item.t}"\n\n${item.tc}\n\n더 많은 정보는 jw.org/ko 를 방문해 보세요.`;
}

function generatePhoneScript(item: TruthItem) {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  const dialogueQ = cleanQ.replace('혹시', '').replace('알고 계셨나요?', '어떻게 생각하시나요?');
  return `[인사 및 소개]\n"안녕하세요, 선생님. 저는 지역에서 봉사하는 [이름]입니다."\n\n[질문]\n"다름이 아니라, ${dialogueQ}"\n\n[성구 및 진리]\n"네, 그렇군요. 성경 ${item.v}에 보면 '${item.t}'라고 알려줍니다."\n\n[마무리]\n"이 내용이 위로가 되었으면 좋겠네요. 더 궁금한 점이 있으신가요?"`;
}

function generateLetter(item: TruthItem) {
  const cleanQ = item.q.replace(/\*\*(.*?)\*\*/g, '$1');
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  
  return `[수신인 성함] 님께,\n\n안녕하십니까. 저는 이웃에 살고 있는 주민입니다. 직접 뵙고 따뜻한 인사를 나누고 싶었지만, 상황이 여의치 않아 이렇게 편지로 대신 마음을 전합니다.\n\n${item.ti}\n\n최근 저도 깊이 생각해 보게 된 질문이 하나 있는데요, 바로 "${cleanQ}"라는 점입니다. 성경 ${item.v}에서는 이 질문에 대해 이렇게 알려 줍니다.\n\n"${item.t}"\n\n이 말씀이 님께 큰 희망과 위로가 되기를 바랍니다. ${item.tc}\n\n더 자세한 내용은 저희 웹사이트 jw.org/ko 를 방문해 보시기 바랍니다. 또한 원하신다면 웹사이트를 통해 무료 성서 연구를 신청하여 성경에 대해 더 자세히 알아보실 수도 있습니다.\n\n건강하시고 평안한 하루 되십시오.\n\n${dateStr}\n[전도인 이름] 드림`;
}

export default CardContainer;
