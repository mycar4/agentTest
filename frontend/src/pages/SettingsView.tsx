// src/pages/SettingsView.tsx
import React from "react";
import { motion } from "framer-motion";
import { Sliders, Trash2 } from "lucide-react";
import { UserProfile, CompanionApp } from "../types";

interface SettingsViewProps {
  profile: UserProfile;
  editingProfile: UserProfile;
  setEditingProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  handleProfileSave: (e: React.FormEvent) => void;
  companionApps: CompanionApp[];
  newCompanion: any;
  setNewCompanion: React.Dispatch<React.SetStateAction<any>>;
  handleAddCompanion: (e: React.FormEvent) => void;
  handleDeleteCompanion: (id: string) => void;
}

export default function SettingsView({
  profile, editingProfile, setEditingProfile, handleProfileSave,
  companionApps, newCompanion, setNewCompanion, handleAddCompanion, handleDeleteCompanion
}: SettingsViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* 아바타 아이덴티티 카드 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
        <img src={profile.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover border" referrerPolicy="no-referrer" />
        <div>
          <h4 className="text-base font-semibold text-slate-900 font-heading">{profile.name}</h4>
          <p className="text-xs text-slate-400 font-light">{profile.email}</p>
          <p className="text-[10.5px] text-slate-700 font-semibold mt-2 bg-slate-50 border px-3 py-1 rounded-full inline-block">{profile.travelStyle}</p>
        </div>
      </div>

      {/* 환경설정 폼 */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">사용자 프로필 설정</h4>
        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-400 font-bold mb-1">사용자 명칭</label>
            <input type="text" value={editingProfile.name} onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })} className="w-full bg-slate-50 border rounded-lg p-2.5 text-xs focus:outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 font-bold mb-1">이메일 계정</label>
            <input type="email" value={editingProfile.email} onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })} className="w-full bg-slate-50 border rounded-lg p-2.5 text-xs focus:outline-none focus:border-slate-900" />
          </div>
          <button type="submit" className="w-full bg-slate-950 text-white py-2.5 rounded-xl text-xs font-semibold tracking-wide shadow-sm">설정 내용 저장</button>
        </form>
      </div>

      {/* 컴패니언 매니저 */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b pb-2.5">
          <Sliders className="w-4 h-4 text-slate-800" />
          <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">외부 가이드 링크 연계 제어</h4>
        </div>
        <div className="space-y-2">
          {companionApps.map(comp => (
            <div key={comp.id} className="bg-slate-50/50 p-3 rounded-xl border flex justify-between items-center gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide mr-1">{comp.category}</span>
                <span className="text-xs font-semibold text-slate-800">{comp.name}</span>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{comp.url}</p>
              </div>
              <button onClick={() => handleDeleteCompanion(comp.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        {/* 연계 등록 폼 서브 양식 */}
        <form onSubmit={handleAddCompanion} className="space-y-3 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={newCompanion.name} onChange={(e) => setNewCompanion({ ...newCompanion, name: e.target.value })} className="bg-slate-50 border rounded-lg p-2 text-xs focus:outline-none" placeholder="가이드 명칭" required />
            <select value={newCompanion.category} onChange={(e) => setNewCompanion({ ...newCompanion, category: e.target.value })} className="bg-slate-50 border rounded-lg p-2 text-xs text-slate-700">
              <option value="AI 비서">AI 비서</option>
              <option value="교통 가이드">교통 가이드</option>
              <option value="가계부/환율">가계부/환율</option>
            </select>
          </div>
          <input type="text" value={newCompanion.url} onChange={(e) => setNewCompanion({ ...newCompanion, url: e.target.value })} className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:outline-none" placeholder="연동 링크 URL (https://...)" required />
          <button type="submit" className="w-full bg-slate-950 text-white py-2 rounded-xl text-xs font-semibold">새로운 페이지 연계 등록</button>
        </form>
      </div>
    </motion.div>
  );
}