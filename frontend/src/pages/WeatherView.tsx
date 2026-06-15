// src/pages/WeatherView.tsx
import React from "react";
import { motion } from "framer-motion";
import { CloudSun, Glasses, Briefcase, Check } from "lucide-react";
import { Itinerary } from "../types";

interface PackingItem {
  id: number;
  item: string;
  checked: boolean;
  category: string;
}

interface WeatherViewProps {
  activeItinerary: Itinerary | undefined;
  packingList: PackingItem[];
  setPackingList: React.Dispatch<React.SetStateAction<PackingItem[]>>;
}

export default function WeatherView({ activeItinerary, packingList, setPackingList }: WeatherViewProps) {
  if (!activeItinerary) return <div className="text-center p-8 text-xs text-gray-400">선택된 일정이 없습니다.</div>;

  const togglePackingCheck = (id: number) => {
    setPackingList(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* 날씨 메인 카드 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white text-center shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{activeItinerary.city} 실시간 기후 현황</p>
        <div className="flex items-center justify-center gap-2.5 my-3">
          <CloudSun className="w-12 h-12 text-slate-300" />
          <span className="text-4xl font-extrabold text-white">{activeItinerary.temperature}</span>
        </div>
        <h4 className="text-md font-semibold mb-1 text-slate-200">안락한 하늘, 완벽한 시계</h4>
        <p className="text-[12px] text-slate-400 font-light leading-relaxed">자외선 노출 지수 2(낮음), 미세먼지 최고 좋음. 도보 투어를 돌기에 최상의 타이밍입니다.</p>
      </div>

      {/* 옷차림 가이드 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
        <div className="flex gap-2 font-semibold text-slate-900 text-sm items-center">
          <Glasses className="w-4.5 h-4.5 text-slate-700" />
          <span>오늘 요약 옷차림 가이드</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block mb-1">상의</span>
            <span className="text-xs font-semibold text-slate-700">린넨 셔츠</span>
          </div>
          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block mb-1">외투</span>
            <span className="text-xs font-semibold text-slate-900">경량 재킷</span>
          </div>
          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block mb-1">신발</span>
            <span className="text-xs font-semibold text-slate-700">쿠션 스니커즈</span>
          </div>
        </div>
      </div>

      {/* 짐싸기 체크리스트 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-slate-950 text-sm flex items-center gap-1.5"><Briefcase className="w-4.5 h-4.5" /> 여행 짐싸기 체크리스트</span>
          <span className="text-xs text-slate-400 font-medium">{packingList.filter(p => p.checked).length} / {packingList.length} 완료</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
          {packingList.map((pi) => (
            <div key={pi.id} onClick={() => togglePackingCheck(pi.id)} className="flex items-center gap-3 cursor-pointer py-2 hover:bg-slate-50/50 rounded transition">
              <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition ${pi.checked ? 'bg-slate-950 border-slate-950 text-white' : 'border-slate-300'}`}>
                {pi.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-xs ${pi.checked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{pi.item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}