
import React from 'react';
import { topics, topicIcons } from '../data';

interface TopicNavProps {
  currentTopic: string;
  onTopicChange: (topic: string) => void;
}

const TopicNav: React.FC<TopicNavProps> = ({ currentTopic, onTopicChange }) => {
  return (
    <div className="relative">
      {/* Edge Fades for scroll indication on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-800 to-transparent pointer-events-none z-10 sm:hidden"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-stone-700 to-transparent pointer-events-none z-10 sm:hidden"></div>
      
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x snap-mandatory px-2 sm:flex-wrap sm:justify-center">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`
              px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap snap-start flex-shrink-0 flex items-center gap-2
              ${currentTopic === topic 
                ? 'bg-white text-stone-800 shadow-xl transform -translate-y-0.5' 
                : 'bg-stone-700/50 text-stone-300 hover:bg-stone-600 hover:text-white border border-stone-600'
              }
            `}
          >
            <span className="text-base">{topicIcons[topic]}</span>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicNav;
