"use client";

import { motion } from "framer-motion";
import type { MbtiProfile } from "../data/mbti";

interface MbtiCardProps {
  profile: MbtiProfile;
  onClick: () => void;
  theme: "aurora" | "sunset" | "mono";
}

const getAvatarEmoji = (code: string) => {
  const map: Record<string, string> = {
    INTJ: "📐", INTP: "🧪", ENTJ: "🎬", ENTP: "🗣️",
    INFJ: "🕯️", INFP: "🍃", ENFJ: "⚔️", ENFP: "🎉",
    ISTJ: "📋", ISFJ: "🛡️", ESTJ: "⚖️", ESFJ: "🤝",
    ISTP: "🔧", ISFP: "🎨", ESTP: "🚀", ESFP: "🎤",
  };
  return map[code] || "🧩";
};

export default function MbtiCard({ profile, onClick, theme }: MbtiCardProps) {
  const accentDot =
    theme === "aurora"
      ? "bg-gradient-to-tr from-sky-400 to-emerald-400"
      : theme === "sunset"
        ? "bg-gradient-to-tr from-rose-400 to-amber-300"
        : "bg-zinc-200";
 
  const emoji = getAvatarEmoji(profile.code);
  const reps =
    profile.representatives && profile.representatives.length > 0
      ? profile.representatives.slice(0, 3).join("、")
      : "";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 bg-clip-padding p-6 text-left shadow-xl backdrop-blur-2xl transition hover:border-white/20 hover:bg-white/10"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-serif text-3xl font-semibold tracking-tight text-zinc-50">
              {profile.code}
            </h3>
            <p className="mt-1 text-sm font-medium text-zinc-300">
              {profile.name}
            </p>
            <p className="mt-1 text-xs text-emerald-300">
              {reps}
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 select-none text-6xl md:text-7xl">
          <span className="drop-shadow-lg">{emoji}</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
        <span className="flex items-center gap-2 text-zinc-300">
          <span className={`inline-flex h-1.5 w-1.5 rounded-full ${accentDot} group-hover:scale-125 transition-transform`} />
          查看详情
        </span>
        <div className="flex -space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
            {/* Tiny decoration or arrow could go here */}
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </div>
      </div>
    </motion.button>
  );
}
