// src/components/BottomNav.tsx
import React from "react";
import { Compass, Search, Calendar, CloudSun } from "lucide-react";

// 상위(App.tsx)로부터 현재 탭 상태와 변경 함수를 전달받음
interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-5 py-3 flex items-center justify-between z-30 shadow-lg">
      <button 
        onClick={() => setActiveTab("home")} 
        className={`flex flex-col items-center gap-1 focus:outline-none transition-all flex-1 ${activeTab === 'home' ? 'text-slate-950 scale-102 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">홈</span>
      </button>

      <button 
        onClick={() => setActiveTab("explore")} 
        className={`flex flex-col items-center gap-1 focus:outline-none transition-all flex-1 ${activeTab === 'explore' ? 'text-slate-950 scale-102 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Search className="w-5 h-5 font-bold" />
        <span className="text-[10px]">탐색</span>
      </button>

      <button 
        onClick={() => setActiveTab("itinerary")} 
        className={`flex flex-col items-center gap-1 focus:outline-none transition-all flex-1 py-1 px-3 ${activeTab === 'itinerary' ? 'bg-slate-950 text-white rounded-xl shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Calendar className={`w-5 h-5 ${activeTab === 'itinerary' ? 'text-white' : ''}`} />
        <span className="text-[10px]">일정</span>
      </button>

      <button 
        onClick={() => setActiveTab("weather")} 
        className={`flex flex-col items-center gap-1 focus:outline-none transition-all flex-1 ${activeTab === 'weather' ? 'text-slate-950 scale-102 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <CloudSun className="w-5 h-5" />
        <span className="text-[10px]">날씨</span>
      </button>
    </nav>
  );
}