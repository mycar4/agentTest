// src/App.tsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Settings, AlertCircle, Compass, Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Itinerary, Stop, UserProfile, CompanionApp } from "./types";









// 모듈화된 서브 부품 및 페이지 뷰 바인딩
import BottomNav from "./components/BottomNav";
import HomeView from "./pages/HomeView";
import ExploreView from "./pages/ExploreView";
import ItineraryView from "./pages/ItineraryView";
import WeatherView from "./pages/WeatherView";
import SettingsView from "./pages/SettingsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [customItineraries, setCustomItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string>("lucerne");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("알찬 관광 & 탐험");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 모달 제어 플래그
  const [showAddStopModal, setShowAddStopModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [newStop, setNewStop] = useState<Partial<Stop>>({
    period: "오전", time: "09:00 - 11:30", tag: "액티비티", title: "", description: "", image: ""
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: "정우진",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    travelStyle: "모험을 즐기는 탐험가",
    email: "webile@gmail.com"
  });
  const [editingProfile, setEditingProfile] = useState<UserProfile>({ ...profile });

  const [packingList, setPackingList] = useState([
    { id: 1, item: "여권 및 신분증", checked: true, category: "필수" },
    { id: 2, item: "휴대폰 충전선 / 보조배터리", checked: true, category: "필수" },
    { id: 3, item: "가벼운 겉옷 / 바람막이", checked: false, category: "의류" },
    { id: 4, item: "도보용 편안한 스니커즈", checked: true, category: "의류" },
    { id: 5, item: "선글라스 및 선크림", checked: false, category: "케어" }
  ]);

  const [companionApps, setCompanionApps] = useState<CompanionApp[]>([
    {
      id: "swiss-companion", name: "스위스 로컬 Companion 가이드",
      url: "https://aistudio.google.com/apps/f09d1a5f-1b60-4deb-8608-69820fa98b1f?showPreview=true&showAssistant=true",
      desc: "환율 계산 및 동시 조력을 담당하는 특화형 AI 비서 앱입니다.", category: "AI 비서"
    }
  ]);
  const [newCompanion, setNewCompanion] = useState({ name: "", url: "", desc: "", category: "AI 비서" });

  useEffect(() => {
  // 기존 mock 코드 대신 백엔드 연동 코드로 교체
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/itineraries");
        setItineraries(response.data); // 백엔드에서 받은 데이터로 상태 업데이트
      } catch (err) {
        console.error("백엔드 연동 실패:", err);
      }
    };
    fetchItineraries();
  }, []);

  const activeItinerary = customItineraries.find(i => i.id === selectedItineraryId) || itineraries.find(i => i.id === selectedItineraryId) || itineraries[0];

  const handleAiPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setLoadingStep(`현재 기후 지수와 최적 타임라인 매칭 연산 중...`);
    setTimeout(() => {
      const mockupCity = searchQuery.trim();
      const fallbackItinerary: Itinerary = {
        id: `fallback-${Date.now()}`, city: mockupCity, title: `${mockupCity}에서 보내는 완벽한 하루`, bestTime: "09:30 AM - 12:00 PM",
        weatherTip: "야외 투어를 즐기기에 최상의 날씨로 예보됩니다.", temperature: "22°C",
        mainImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000",
        stops: [
          { period: "오전", time: "08:30 - 11:30", tag: "현지 라이프", title: `${mockupCity} 아침 마켓 골목 투어`, description: "따뜻한 드립 커피와 함께 상쾌한 아침 공기를 마시며 산책합니다.", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", completed: false }
        ]
      };
      setCustomItineraries(prev => [fallbackItinerary, ...prev]);
      setSelectedItineraryId(fallbackItinerary.id);
      setActiveTab("itinerary");
      setSearchQuery("");
      setLoading(false);
      setErrorMsg("💡 API 가상 포워딩 연동 성공: 맞춤 스케줄 도출이 마감되었습니다.");
    }, 1800);
  };

  const toggleStopCompletion = (index: number) => {
    if (!activeItinerary) return;
    const updated = [...activeItinerary.stops];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    setCustomItineraries(prev => prev.map(i => i.id === activeItinerary.id ? { ...i, stops: updated } : i));
    setItineraries(prev => prev.map(i => i.id === activeItinerary.id ? { ...i, stops: updated } : i));
  };

  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStop.title || !newStop.description || !activeItinerary) return;
    const configured: Stop = {
      period: newStop.period || "오전", time: newStop.time || "09:00 - 11:00", tag: newStop.tag || "일반",
      title: newStop.title, description: newStop.description, image: newStop.image || undefined, completed: false
    };
    const updated = [...activeItinerary.stops, configured];
    setCustomItineraries(prev => prev.map(i => i.id === activeItinerary.id ? { ...i, stops: updated } : i));
    setItineraries(prev => prev.map(i => i.id === activeItinerary.id ? { ...i, stops: updated } : i));
    setNewStop({ period: "오후", time: "15:00 - 17:00", tag: "탐험", title: "", description: "", image: "" });
    setShowAddStopModal(false);
  };

  const handleDeleteItinerary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomItineraries(prev => prev.filter(item => item.id !== id));
    if (selectedItineraryId === id) setSelectedItineraryId("lucerne");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault(); setProfile({ ...editingProfile }); alert("정보 수정완료!");
  };

  const handleAddCompanion = (e: React.FormEvent) => {
    e.preventDefault(); if (!newCompanion.name || !newCompanion.url) return;
    setCompanionApps([...companionApps, { id: `comp-${Date.now()}`, ...newCompanion }]);
    setNewCompanion({ name: "", url: "", desc: "", category: "AI 비서" });
  };

  const getMarkdownText = () => `## ${activeItinerary?.city} 일정표\n\n최적시간: ${activeItinerary?.bestTime}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between items-center sm:py-8 font-sans">
      <div id="phone-container" className="w-full max-w-[420px] bg-white sm:rounded-3xl shadow-xl min-h-screen sm:min-h-[840px] flex flex-col relative overflow-hidden border border-gray-100">
        
        {/* 상단 통합 헤더 */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile.avatarUrl} onClick={() => setActiveTab("settings")} alt="avatar" className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow-sm cursor-pointer" />
            <div>
              <p className="text-[12px] text-gray-400 font-semibold">{profile.travelStyle}</p>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight font-heading">Horizon Bound</h1>
            </div>
          </div>
          {/* <button onClick={() => setActiveTab("settings")} className={`p-2 rounded-full ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-400'}`}><Settings className="w-5 h-5" /></button> */}
        </header>

        {/* 글로벌 알림 배너 */}
        {errorMsg && (
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-start gap-2.5 text-[12.5px] text-amber-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{errorMsg}</div>
            <button onClick={() => setErrorMsg(null)} className="text-amber-500 font-bold px-1.5">확인</button>
          </div>
        )}

        {/* 로딩 인디케이터 바 
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center">
              <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">{loadingStep}</h3>
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* 라우팅 코어 워크스페이스 세그먼트 */}
        <main className="flex-1 overflow-y-auto px-5 py-5 pb-24 bg-gray-50">
          {activeTab === "home" && (
            <HomeView 
              profile={profile} setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} handleAiPlan={handleAiPlan}
              companionApps={companionApps} itineraries={itineraries} customItineraries={customItineraries}
              setSelectedItineraryId={setSelectedItineraryId} handleDeleteItinerary={handleDeleteItinerary}
            />
          )}
          {activeTab === "explore" && <ExploreView />}
          {activeTab === "itinerary" && (
            <ItineraryView 
              itineraries={itineraries} customItineraries={customItineraries} selectedItineraryId={selectedItineraryId}
              setSelectedItineraryId={setSelectedItineraryId} activeItinerary={activeItinerary}
              toggleStopCompletion={toggleStopCompletion} setShowAddStopModal={setShowAddStopModal} setShowShareModal={setShowShareModal}
            />
          )}
          {activeTab === "weather" && (
            <WeatherView activeItinerary={activeItinerary} packingList={packingList} setPackingList={setPackingList} />
          )}
          {activeTab === "settings" && (
            <SettingsView 
              profile={profile} editingProfile={editingProfile} setEditingProfile={setEditingProfile} handleProfileSave={handleProfileSave}
              companionApps={companionApps} newCompanion={newCompanion} setNewCompanion={setNewCompanion}
              handleAddCompanion={handleAddCompanion} handleDeleteCompanion={(id) => setCompanionApps(prev => prev.filter(c => c.id !== id))}
            />
          )}
        </main>

        {/* 하단 탭 메뉴 */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 팝업 모달 오버레이 슬라이드 슬롯 (커스텀 항목 추가 모달) */}
        <AnimatePresence>
          {showAddStopModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 z-40 flex items-end justify-center">
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-3xl p-6 space-y-4 shadow-xl border-t text-slate-800">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold">세부 일정 항목 추가</h3>
                  <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 font-semibold text-xs">취소</button>
                </div>
                <form onSubmit={handleAddStopSubmit} className="space-y-3">
                  <input type="text" value={newStop.title} onChange={(e) => setNewStop({ ...newStop, title: e.target.value })} className="w-full bg-slate-50 border rounded-lg p-2 text-xs" placeholder="항목 이름 (예: 카펠교 산책)" required />
                  <textarea value={newStop.description} onChange={(e) => setNewStop({ ...newStop, description: e.target.value })} className="w-full bg-slate-50 border rounded-lg p-2 text-xs h-16 resize-none" placeholder="상세 설명을 입력하세요" required />
                  <button type="submit" className="w-full bg-slate-950 text-white py-2 rounded-xl text-xs font-semibold">추가 완료</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 팝업 모달 오버레이 슬라이드 슬롯 (연계 전송 모달) */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-[340px] rounded-2xl p-5 space-y-4 border text-slate-800 text-center">
                <h3 className="text-sm font-bold border-b pb-2">연계 디바이스 및 가이드 전송</h3>
                <div className="space-y-3 text-left">
                  <input type="text" readOnly value={`${window.location.origin}/?city=${encodeURIComponent(activeItinerary?.city || "")}`} className="bg-slate-50 border rounded-lg p-2 text-[11px] font-mono w-full" />
                  <button 
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?city=${encodeURIComponent(activeItinerary?.city || "")}`); setCopiedLink(true); }}
                    className="w-full bg-slate-950 text-white py-2 rounded-xl text-xs font-semibold"
                  >
                    {copiedLink ? "정상 복사 완료!" : "공유 주소 복사"}
                  </button>
                </div>
                <button onClick={() => { setShowShareModal(false); setCopiedLink(false); }} className="text-slate-400 text-xs font-semibold underline block mx-auto">닫기</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}