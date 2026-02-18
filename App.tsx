
import React, { useState } from 'react';
import { AppMode, TruthItem } from './types';
import { topics, truthsData } from './data';
import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import TopicNav from './components/TopicNav';
import CardContainer from './components/CardContainer';
import AIGenerator from './components/AIGenerator';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CONVERSATION);
  const [currentTopic, setCurrentTopic] = useState<string>(topics[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed break-keep">
            상황에 맞는 <strong>주제</strong>와 <strong>방법</strong>을 선택하세요.<br />
            맞춤형 제안이 대화를 돕습니다.
          </p>
        </section>

        {/* AI Generator Section */}
        <AIGenerator />

        <section id="conversation-tool" className="bg-gradient-to-br from-stone-800 to-stone-700 rounded-2xl shadow-2xl text-white p-4 sm:p-10 transition-all duration-500 overflow-hidden">
          
          <div className="mb-8">
            <ModeSwitcher 
              currentMode={currentMode} 
              onModeChange={setCurrentMode} 
            />
          </div>

          <div className="mb-8">
            <TopicNav 
              currentTopic={currentTopic} 
              onTopicChange={setCurrentTopic} 
            />
          </div>

          <CardContainer 
            mode={currentMode} 
            items={truthsData[currentTopic]} 
            onCopy={handleCopy}
            copiedText={copiedId}
          />
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm">© 2024 Watch Tower Bible and Tract Society of Pennsylvania.</p>
          <p className="text-xs mt-2 text-stone-500">Based on booklet: lmd-KO</p>
          <p className="text-[10px] mt-4 opacity-50">본 도구는 교육 및 봉사 활동을 돕기 위해 제작된 보조 도구입니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
