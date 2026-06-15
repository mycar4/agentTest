// src/pages/HomeView.tsx
import React from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, Search, Smartphone, CornerDownRight, Clock, Trash2 } from "lucide-react";
import { UserProfile, CompanionApp, Itinerary } from "../types";

// App.tsx로부터 넘겨받을 데이터(Props) 타입 정의
interface HomeViewProps {
  profile: UserProfile;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  handleAiPlan: (e: React.FormEvent) => void;
  companionApps: CompanionApp[];
  itineraries: Itinerary[];
  customItineraries: Itinerary[];
  setSelectedItineraryId: (id: string) => void;
  handleDeleteItinerary: (id: string, e: React.MouseEvent) => void;
}

export default function HomeView({
  profile, setActiveTab, searchQuery, setSearchQuery, selectedStyle, setSelectedStyle,
  handleAiPlan, companionApps, itineraries, customItineraries, setSelectedItineraryId, handleDeleteItinerary
}: HomeViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* 1. 환영 인사 카드 */}
      <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
          <Compass className="w-40 h-40" />
        </div>
        <h2 className="text-xl font-light tracking-tight mb-2 font-heading">안녕하세요, <span className="font-semibold">{profile.name}</span>님!</h2>
        <p className="text-[12.5px] text-slate-400 font-light leading-relaxed mb-5">
          오늘도 마음에 꼭 들어맞는 나만의 여행 일정을 수립해 보세요. 세계적인 AI 기술이 맞춤 코스를 추천해 줍니다.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("itinerary")} className="bg-white text-slate-950 text-[12px] font-medium px-4.5 py-2.5 rounded-full shadow-sm hover:bg-slate-50 transition">
            내 여정 확인하기
          </button>
          <button onClick={() => { setSearchQuery("바르셀로나"); document.getElementById("ai-search-input")?.focus(); }} className="bg-slate-800 text-slate-200 text-[12px] font-medium px-4.5 py-2.5 rounded-full hover:bg-slate-700 transition border border-slate-700/40">
            추천지 검색
          </button>
        </div>
      </div>

      {/* 2. AI 초정밀 생성 폼 */}
      <div className="bg-white p-5.5 rounded-2xl border border-slate-200/60 shadow-sm shadow-slate-100/40">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-slate-100 p-1.5 rounded-lg text-slate-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 text-sm font-heading tracking-tight">AI 초정밀 맞춤 일정 생성</h3>
        </div>
        <form onSubmit={handleAiPlan} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-2">희망 여행 도시</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input 
                id="ai-search-input" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 뉴욕, 로마, 싱가포르, 피렌체"
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-950 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all" required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-2">내가 추구하는 여행 스타일</label>
            <div className="grid grid-cols-2 gap-2">
              {["알찬 관광 & 탐험", "여유와 감성 힐링", "맛집 & 미식 로드", "역사 및 미술관 투어"].map((styleValue) => (
                <button
                  key={styleValue} type="button" onClick={() => setSelectedStyle(styleValue)}
                  className={`py-2 px-3 rounded-lg text-[12px] text-left transition-all border font-medium ${selectedStyle === styleValue ? 'bg-slate-900 text-white border-slate-900 font-medium' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  {styleValue}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-white fill-current" />
            <span>AI 완벽한 일정 도출하기 (무료)</span>
          </button>
        </form>
      </div>

      {/* 3. 컴패니언 앱 연동 위젯 */}
      <div className="bg-slate-50 border border-slate-200/50 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4.5 h-4.5 text-slate-800" />
            <h3 className="font-semibold text-slate-900 text-sm font-heading tracking-tight">연계 컴패니언 페이지</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {companionApps.map((app) => (
            <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer" className="group block bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400/80 shadow-sm transition-all duration-350">
              <div className="flex justify-between items-start mb-1.5">
                <span className="text-[9.5px] uppercase font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{app.category}</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-[13px] font-semibold text-slate-900 tracking-tight group-hover:underline decoration-slate-400 underline-offset-2">{app.name}</h4>
              <p className="text-[11.5px] text-slate-500 font-light line-clamp-2 leading-relaxed mt-1">{app.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* 4. 엄선된 시그니처 가이드 (일정 리스트) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 text-sm font-heading tracking-tight">엄선된 시그니처 가이드</h3>
        </div>
        <div className="space-y-4">
          {/* 기본 제공 일정들 */}
          {itineraries.map((it) => (
            <div key={it.id} onClick={() => { setSelectedItineraryId(it.id); setActiveTab("itinerary"); }} className="group cursor-pointer bg-white p-3.5 rounded-2xl shadow-sm shadow-slate-100/30 hover:shadow-md transition-all border border-slate-200/60 flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                <img src={it.mainImage} alt={it.city} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer"/>
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[9.5px] px-2 py-0.5 rounded font-black tracking-wider uppercase">{it.temperature}</div>
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{it.city}</p>
                  <h4 className="text-sm font-semibold text-slate-800 tracking-tight group-hover:text-black transition-colors">{it.title}</h4>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> 최적: {it.bestTime.split(" ")[0]}~</span>
                  <span className="text-[10.5px] text-slate-950 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">일정 보기 &rarr;</span>
                </div>
              </div>
            </div>
          ))}

          {/* 내가 생성한 커스텀 일정들 */}
          {customItineraries.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">내가 생성한 커스텀 일정</h4>
              <div className="space-y-3">
                {customItineraries.map((it) => (
                  <div key={it.id} onClick={() => { setSelectedItineraryId(it.id); setActiveTab("itinerary"); }} className="bg-white p-3.5 rounded-2xl shadow-sm shadow-slate-100/30 border border-slate-200/70 flex gap-4 relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={it.mainImage} alt={it.city} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Custom</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 pr-6">{it.title}</h4>
                        <span className="text-[10.5px] text-slate-400 font-medium tracking-tight block">최적 추천 타임: {it.bestTime}</span>
                      </div>
                    </div>
                    <button onClick={(e) => handleDeleteItinerary(it.id, e)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-1.5 rounded-full hover:bg-slate-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}