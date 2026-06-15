// src/pages/ExploreView.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, Heart } from "lucide-react";

export default function ExploreView() {
  const [exploreTabCategory, setExploreTabCategory] = useState<string>("전체");

  // 엄선된 추천 꿀팁 콘텐츠 데이터
  const exploreArticles = [
    {
      title: "스위스에서 이것만은 실수하지 마세요",
      category: "꿀팁",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
      desc: "대부분의 기차 탑승구는 약속 시간 칼같이 출발하므로 5분 전 대기는 필수입니다. 일요일에는 대부분의 대형마트가 휴점합니다.",
      tag: "에티켓"
    },
    {
      title: "알프스 패스 백배 활용법",
      category: "교통",
      image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=500",
      desc: "스위스 트래블 패스 한 장으로 기차, 버스, 보트는 물론이고 스위스 전역의 500개 이상 박물관까지 공짜로 입장해 보세요.",
      tag: "세이버"
    },
    {
      title: "동화 속에 들어선 듯한 루체른 역사 산책로",
      category: "전망",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500",
      desc: "호숫가 광장에서 시작해 빈사자의 기념비와 에멘탈 치즈 플래터를 곁들인 테라스 와인 한 잔의 기쁨을 만나보세요.",
      tag: "낭만 투어"
    },
    {
      title: "천상의 일출 필라투스 등반 노하우",
      category: "액티비티",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
      desc: "세계 최경사 코스모스 톱니바퀴 열차를 탑승할 때는 무조건 상향 방향 기준으로 우측 창가 좌석에 앉아야 전경이 보입니다.",
      tag: "강추 코스"
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* 카테고리 필터 필즈 */}
      <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar-x">
        {["전체", "꿀팁", "교통", "전망", "액티비티"].map((cat) => (
          <button
            key={cat} onClick={() => setExploreTabCategory(cat)}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all focus:outline-none shrink-0 border ${exploreTabCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200/70'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 아티클 카드 목록 */}
      <div className="space-y-4">
        {exploreArticles
          .filter(art => exploreTabCategory === "전체" || art.category === exploreTabCategory)
          .map((art, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-200/20 border border-slate-200/60 hover:shadow-md transition duration-300">
              <div className="h-44 relative">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">{art.category}</div>
                <div className="absolute bottom-3.5 right-3.5 bg-slate-950 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md">#{art.tag}</div>
              </div>
              <div className="p-4.5 space-y-2.5">
                <h4 className="font-semibold text-slate-900 text-[14.5px] leading-snug tracking-tight">{art.title}</h4>
                <p className="text-[12.5px] text-slate-500 leading-relaxed font-light">{art.desc}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                  <button onClick={() => alert(`"${art.title}" 위시리스트 저장이 완료되었습니다.`)} className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <Heart className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors" />
                    <span>위시리스트 저장</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-normal">조회수 1.4K</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* 오프라인 비상 안내 수칙 */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
        <div className="flex gap-2 mb-2 font-semibold text-slate-900 text-sm font-heading">
          <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
          <span>스위스 오프라인 비상 수칙</span>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed font-light mb-4">
          스위스의 치안은 수준급이나 관광지의 소매치기는 주의가 따릅니다. 비상구조 번호 <b>117(공통 경찰)</b> 혹은 <b>144(구급 구조)</b>를 사전 등록해 놓는 것을 추천합니다.
        </p>
        <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-sm">
          <a href="tel:117" className="text-xs font-semibold text-slate-900 block hover:underline">🚑 스위스 연방 비상 전화 연결</a>
        </div>
      </div>
    </motion.div>
  );
}