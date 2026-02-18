
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIResult } from '../types';

type TabType = 'proposal' | 'polishing';
type PolishStyle = 'warm' | 'polite' | 'natural' | 'short' | 'long';

interface PolishResult {
  text: string;
  verseRef: string;
  verseText: string;
}

const AIGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('proposal');
  
  // Proposal State
  const [proposalInput, setProposalInput] = useState('');
  const [proposalResult, setProposalResult] = useState<AIResult | null>(null);
  
  // Polishing State
  const [polishInput, setPolishInput] = useState('');
  const [polishResult, setPolishResult] = useState<PolishResult | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PolishStyle | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetProposal = () => {
    setProposalInput('');
    setProposalResult(null);
    setError(null);
  };

  const resetPolishing = () => {
    setPolishInput('');
    setPolishResult(null);
    setSelectedStyle(null);
    setError(null);
  };

  const generateProposal = async () => {
    if (!proposalInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setProposalResult(null);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the latest API key.
      const apiKey = import.meta.env.VITE_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `다음 상황에 대해 성경 원칙과 jw.org 자료의 논조를 바탕으로 대화 제안을 만들어줘: "${proposalInput}"` }] }],
        config: {
          systemInstruction: "당신은 성경 교육 및 위로 전문가입니다. 입력된 상황을 신중하게 분석한 뒤 대화를 시작하세요. 상황에 맞는 따뜻한 대화 시작법(opening), 관련 성경 구절 장절(verse), 성경 구절 전문 내용(verseText), 핵심 진리, 그리고 대화를 이어갈 재방문 질문을 JSON 형식으로 제공하세요. 한국어로 답변하세요. 모든 신칭은 '하나님' 대신 반드시 '하느님'으로 표기하고, 성경 구절(verseText)은 반드시 wol.jw.org의 '신세계역 성경' 내용을 바탕으로 작성하세요. 여호와의 증인의 봉사 원칙에 따라 명절 인사를 직접 사용하는 것을 피하고, 대화 시작(opening) 시에는 즉시 성경 질문을 하기보다 상대방의 상황에 공감하며 자연스럽게 이어가는 대화문을 작성하세요. 특히 질문은 최대 한 번으로 제한하여 상대방이 부담을 느끼지 않게 하세요.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              opening: { type: Type.STRING },
              script: { type: Type.STRING },
              verse: { type: Type.STRING },
              verseText: { type: Type.STRING },
              truth: { type: Type.STRING },
              followUp: { type: Type.STRING }
            },
            required: ["opening", "script", "verse", "verseText", "truth", "followUp"]
          }
        },
      });

      // Extract generated text directly from response.text property.
      let jsonStr = response.text?.trim();
      if (jsonStr) {
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        setProposalResult(JSON.parse(jsonStr));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const polishMessage = async (style: PolishStyle) => {
    if (!polishInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setPolishResult(null);
    setSelectedStyle(style);

    const styleInstructions = {
      warm: "따뜻하고 다정하며 위로가 되는 말투",
      polite: "매우 정중하고 격식 있는 말투",
      natural: "자연스럽고 일상적인 대화체",
      short: "핵심만 남기고 아주 간결하고 명료하게 요약한 말투",
      long: "상대방에 대한 배려와 따뜻한 표현을 더 풍부하게 덧붙여 길게 작성한 말투"
    };

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the latest API key.
      const apiKey = import.meta.env.VITE_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: `다음 초안을 ${styleInstructions[style]}로 다듬어주고, 이 메시지의 주제와 가장 잘 어울리는 성경 구절도 하나 추천해줘: "${polishInput}"` }] }],
        config: {
          systemInstruction: "당신은 한국어 메시지 작성 및 성경 지식 전문가입니다. 다듬어진 텍스트(text)는 가독성을 위해 의미가 바뀌는 부분에서 2번의 줄바꿈을 사용하여 문단을 명확히 나누어 작성하세요. 추천 성구 장절(verseRef), 성구 내용(verseText)을 JSON 형식으로만 응답하세요. 모든 신칭은 '하나님' 대신 반드시 '하느님'으로 표기하고, 성경 구절(verseText)은 반드시 wol.jw.org의 '신세계역 성경' 내용을 바탕으로 작성하세요. 또한 여호와의 증인의 봉사 원칙에 따라 '새해 복 많이 받으세요'와 같은 세속적인 명절 인사를 직접 사용하는 것을 피하고, 대신 따뜻하고 정중하게 대화를 시작하거나 성경적인 화제로 자연스럽게 전환하는 표현을 사용하세요.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "문단이 잘 나누어진 다듬어진 메시지 내용" },
              verseRef: { type: Type.STRING, description: "추천 성구 장절 (예: 시편 37:29)" },
              verseText: { type: Type.STRING, description: "추천 성구의 전체 텍스트 내용" }
            },
            required: ["text", "verseRef", "verseText"]
          }
        }
      });

      // Extract generated text directly from response.text property.
      let jsonStr = response.text?.trim();
      if (jsonStr) {
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        setPolishResult(JSON.parse(jsonStr));
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    const apiKeyExists = !!(import.meta.env.VITE_API_KEY || (process.env as any).API_KEY);
    const errorMessage = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      setError("API 사용량이 초과되었습니다. 유료 프로젝트의 키를 선택해 주세요.");
    } else if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("API key not valid")) {
      setError("API 키가 유효하지 않거나 모델을 찾을 수 없습니다.");
    } else if (!apiKeyExists) {
      setError("API 키가 설정되지 않았습니다. .env 파일에 VITE_API_KEY를 설정하거나 API 설정을 확인해주세요.");
    } else {
      setError(`오류가 발생했습니다: ${errorMessage}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다!");
  };

  return (
    <section className="bg-amber-50/50 border border-amber-100 rounded-3xl p-1 sm:p-2 shadow-sm overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-5 sm:p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-amber-900">AI 봉사 도우미</h2>
          </div>
        </div>

        <div className="flex border-b border-amber-200">
          <button 
            onClick={() => setActiveTab('proposal')}
            className={`flex-1 py-3 text-sm font-bold transition-all relative ${activeTab === 'proposal' ? 'text-amber-800' : 'text-stone-400 hover:text-stone-600'}`}
          >
            상황별 제안
            {activeTab === 'proposal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('polishing')}
            className={`flex-1 py-3 text-sm font-bold transition-all relative ${activeTab === 'polishing' ? 'text-amber-800' : 'text-stone-400 hover:text-stone-600'}`}
          >
            메시지 다듬기
            {activeTab === 'polishing' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'proposal' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-sm text-amber-800/70 leading-relaxed break-keep">
                구체적인 상황을 입력하면, 성경 원칙에 근거한 제안을 만들어줍니다.
              </p>
              {proposalResult && (
                <button onClick={resetProposal} className="text-[10px] text-stone-500 hover:text-stone-800 underline">초기화</button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 p-2 shadow-inner focus-within:ring-2 focus-within:ring-amber-400 transition-all">
              <textarea
                value={proposalInput}
                onChange={(e) => setProposalInput(e.target.value)}
                disabled={loading}
                placeholder="이웃이 반려견을 잃어 슬퍼해..."
                className="w-full min-h-[100px] p-3 text-stone-800 placeholder-stone-300 resize-none outline-none text-base"
              />
              <div className="flex justify-end p-2">
                <button
                  onClick={generateProposal}
                  disabled={loading || !proposalInput.trim()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all ${loading ? 'bg-amber-300' : 'bg-amber-600 hover:bg-amber-700 shadow-md'}`}
                >
                  {loading ? '제안 생성 중...' : '제안 생성 ⚡'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-sm text-amber-800/70 leading-relaxed break-keep">
                초안을 입력하면 더 좋은 표현으로 다듬어 드립니다.
              </p>
              {polishResult && (
                <button onClick={resetPolishing} className="text-[10px] text-stone-500 hover:text-stone-800 underline">초기화</button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 p-2 shadow-inner focus-within:ring-2 focus-within:ring-amber-400 transition-all">
              <textarea
                value={polishInput}
                onChange={(e) => setPolishInput(e.target.value)}
                disabled={loading}
                placeholder="다듬고 싶은 내용을 여기에 적어주세요."
                className="w-full min-h-[120px] p-3 text-stone-800 placeholder-stone-300 resize-none outline-none text-base"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {(['warm', 'polite', 'natural', 'short', 'long'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => polishMessage(style)}
                  disabled={loading || !polishInput.trim()}
                  className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border text-xs sm:text-sm
                    ${style === 'warm' ? 'bg-orange-50 text-orange-800 border-orange-100 hover:bg-orange-100' : ''}
                    ${style === 'polite' ? 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100' : ''}
                    ${style === 'natural' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100' : ''}
                    ${style === 'short' ? 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-slate-100' : ''}
                    ${style === 'long' ? 'bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100' : ''}
                    ${loading && selectedStyle === style ? 'ring-2 ring-offset-2 ring-stone-400' : 'active:scale-95'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${style === 'long' || style === 'short' ? 'col-span-1' : ''}
                  `}
                >
                  {style === 'warm' ? '🔥 따뜻하게' : 
                   style === 'polite' ? '👔 정중하게' : 
                   style === 'natural' ? '🌿 자연스럽게' :
                   style === 'short' ? '✂️ 간략하게' : '📝 더 길게'}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-8 p-12 bg-white/50 border border-dashed border-amber-300 rounded-3xl flex flex-col items-center justify-center animate-pulse">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
            <p className="text-amber-800 font-medium animate-bounce">AI가 분석 중입니다...</p>
          </div>
        )}

        {/* Proposal Results */}
        {activeTab === 'proposal' && proposalResult && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">👋 인사 및 대화 시작</span>
                <p className="text-stone-800 leading-relaxed font-medium flex-grow">{proposalResult.opening}</p>
              </div>
              <div className="bg-amber-600 p-6 rounded-2xl shadow-lg text-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-amber-100 uppercase tracking-widest block">📖 관련 성구</span>
                  <a 
                    href={`https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(proposalResult.verse)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded border border-white/30 transition-colors flex items-center gap-1 font-bold"
                  >
                    라이브러리 🔗
                  </a>
                </div>
                <p className="text-lg leading-relaxed font-serif mb-3">"{proposalResult.verse}"</p>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-sm leading-relaxed opacity-90 break-keep whitespace-pre-wrap font-medium">
                    {proposalResult.verseText}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">💡 핵심 진리</span>
              <p className="text-stone-700 leading-relaxed">{proposalResult.truth}</p>
            </div>
            <div className="bg-stone-800 p-6 rounded-2xl shadow-xl text-stone-200">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">❓ 재방문 질문</span>
              <p className="text-base font-bold text-white mb-4">"{proposalResult.followUp}"</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => copyToClipboard(`[인사] ${proposalResult.opening}\n[성구] ${proposalResult.verse}\n[진리] ${proposalResult.truth}\n[재방문] ${proposalResult.followUp}`)}
                  className="flex-1 text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 px-4 py-3 rounded-xl transition-colors font-bold"
                >
                  내용 복사
                </button>
                <button onClick={resetProposal} className="px-4 py-3 text-xs bg-stone-900 text-stone-400 rounded-xl hover:text-white transition-colors">
                  다시 하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Polishing Results */}
        {activeTab === 'polishing' && polishResult && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-lg relative space-y-6">
              <div className="absolute -top-3 left-6 px-4 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                다듬어진 메시지
              </div>
              
              <div className="pt-2">
                <p className="text-stone-800 leading-[1.8] sm:leading-[2] text-base sm:text-lg whitespace-pre-wrap break-keep font-medium tracking-tight">
                  {polishResult.text}
                </p>
              </div>

              {/* Recommend Verse Section */}
              <div className="pt-6 border-t border-amber-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-full w-fit">
                    <span>📖 추천 성구: {polishResult.verseRef}</span>
                  </div>
                  <a 
                    href={`https://wol.jw.org/ko/wol/l/r8/lp-ko?q=${encodeURIComponent(polishResult.verseRef)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline font-bold px-1 flex items-center gap-1"
                  >
                    JW 온라인 라이브러리에서 보기 🔗
                  </a>
                </div>
                <p className="mt-3 text-stone-500 text-sm leading-relaxed pl-1 border-l-2 border-amber-100 ml-1">
                  "{polishResult.verseText}"
                </p>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button onClick={resetPolishing} className="px-6 py-2.5 text-sm bg-stone-100 text-stone-500 rounded-xl hover:bg-stone-200 transition-colors font-bold">
                  다시 쓰기
                </button>
                <button 
                  onClick={() => copyToClipboard(polishResult.text)}
                  className="bg-stone-800 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-900 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  메시지 복사하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIGenerator;
