// src/pages/ItineraryView.tsx
import React from "react";
import { motion } from "framer-motion";
import { Info, RefreshCw, Calendar, Plus, Check, Sun, Utensils, MapPin, Moon, Compass } from "lucide-react";
import { Itinerary } from "../types";

interface ItineraryViewProps {
  itineraries: Itinerary[];
  customItineraries: Itinerary[];
  selectedItineraryId: string;
  setSelectedItineraryId: (id: string) => void;
  activeItinerary: Itinerary | undefined;
  toggleStopCompletion: (index: number) => void;
  setShowAddStopModal: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
}

export default function ItineraryView({
  itineraries, customItineraries, selectedItineraryId, setSelectedItineraryId,
  activeItinerary, toggleStopCompletion, setShowAddStopModal, setShowShareModal
}: ItineraryViewProps) {
  
  if (!activeItinerary) return <div className="text-center p-8 text-xs text-gray-400">선택된 일정이 없습니다.</div>;

  const renderPeriodIcon = (period: string) => {
    switch (period) {
      case "오전": return <Sun className="w-5 h-5" />;
      case "점심": return <Utensils className="w-[18px] h-[18px]" />;
      case "오후": return <MapPin className="w-4.5 h-4.5" />;
      case "저녁": return <Moon className="w-4.5 h-4.5" />;
      default: return <Compass className="w-4.5 h-4.5" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* 도시 변경 셀렉터 */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">대상 도시 변경:</span>
        <select 
          value={selectedItineraryId} onChange={(e) => setSelectedItineraryId(e.target.value)}
          className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 px-3.5 py-2.5 rounded-xl flex-1 focus:outline-none shadow-sm"
        >
          <optgroup label="기본 추천 도시">
            {itineraries.map(it => <option key={it.id} value={it.id}>{it.city} ({it.title})</option>)}
          </optgroup>
          {customItineraries.length > 0 && (
            <optgroup label="내가 AI로 계획한 도시">
              {customItineraries.map(it => <option key={it.id} value={it.id}>{it.city}</option>)}
            </optgroup>
          )}
        </select>
      </div>

      {/* 메인 커버 카드 */}
      <div className="relative h-60 rounded-2xl overflow-hidden shadow-md group border border-slate-200/50">
        <img src={activeItinerary.mainImage} alt={activeItinerary.city} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl border border-white/40 shadow-sm rounded-full py-1.5 px-4 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{activeItinerary.temperature}</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h2 className="text-xl font-semibold font-heading">{activeItinerary.title}</h2>
          <p className="text-[12px] opacity-90 font-medium tracking-wide">방문 최적 시간: {activeItinerary.bestTime}</p>
        </div>
      </div>

      {/* 날씨 꿀팁 */}
      <div className="bg-slate-50 rounded-2xl p-4.5 flex gap-3.5 shadow-sm border border-slate-200">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">현지 날씨 꿀팁</h4>
          <p className="text-[12px] text-slate-700 leading-relaxed font-light">{activeItinerary.weatherTip}</p>
        </div>
      </div>

      {/* 동기화 전송 박스 */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-3">
          <RefreshCw className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">동기화 및 연계 전송</h4>
            <p className="text-[11.5px] text-slate-600 font-light leading-relaxed">현재 가이드 데이터를 외부 장치로 딥링크 포워딩합니다.</p>
          </div>
        </div>
        <button onClick={() => setShowShareModal(true)} className="bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-semibold px-3.5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap">연계 전송 🔗</button>
      </div>

      {/* 헤더 및 추가 버튼 */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-semibold text-slate-900 text-sm font-heading flex items-center gap-1.5"><Calendar className="w-4 h-4" /> <span>일정 스케줄러 세부항목</span></h3>
        <button onClick={() => setShowAddStopModal(true)} className="bg-slate-950 text-white text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm"><Plus className="w-3.5 h-3.5" /> <span>커스텀 항목 추가</span></button>
      </div>

      {/* 점선 타임라인 슬롯 */}
      <div className="relative pl-12 space-y-6 pt-2">
        <div className="absolute left-[21px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300"></div>
        {activeItinerary.stops.map((stop, idx) => (
          <div key={idx} className="relative">
            <div 
              onClick={() => toggleStopCompletion(idx)}
              className={`absolute -left-[45px] top-0 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer select-none border shadow-sm transition ${stop.completed ? 'bg-slate-100 text-slate-300 border-slate-200' : 'bg-slate-950 text-white border-slate-950 hover:bg-slate-800'}`}
            >
              {stop.completed ? <Check className="w-5 h-5" /> : renderPeriodIcon(stop.period)}
            </div>
            <div className={`bg-white p-5 rounded-2xl border transition ${stop.completed ? 'border-slate-200 bg-slate-50/80 text-slate-400 opacity-60' : 'border-slate-200/60'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold">{stop.period}</span>
                <span className="text-xs text-slate-400 font-medium">{stop.time}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{stop.tag}</span>
              <h4 className="text-base font-bold text-slate-950 mb-1">{stop.title}</h4>
              <p className="text-[12.5px] leading-relaxed font-light">{stop.description}</p>
              {stop.image && (
                <div className="rounded-xl overflow-hidden h-32 mt-3 shadow-sm">
                  <img src={stop.image} alt={stop.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 완료 지표 뱃지 */}
      <div className="bg-white p-4.5 rounded-2xl text-center shadow-sm border border-slate-200/60 flex items-center justify-around">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">진행 일정 수</p>
          <p className="text-lg font-bold text-slate-900">{activeItinerary.stops.filter(s => s.completed).length} / {activeItinerary.stops.length}</p>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">이동 수단 가이드</p>
          <p className="text-xs font-semibold text-slate-900 underline">골든 패스 열차</p>
        </div>
      </div>
    </motion.div>
  );
}