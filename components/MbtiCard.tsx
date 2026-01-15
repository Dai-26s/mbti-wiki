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

  const temperamentKey = `${profile.code[1]}${profile.code[2]}`;

  const cardStyle =
    theme === "aurora"
      ? temperamentKey === "NT"
        ? "border-sky-400/40 bg-gradient-to-br from-slate-950/80 via-sky-950/60 to-emerald-900/40"
        : temperamentKey === "NF"
          ? "border-violet-400/40 bg-gradient-to-br from-slate-950/80 via-violet-950/60 to-fuchsia-900/40"
          : temperamentKey === "SJ"
            ? "border-emerald-300/35 bg-gradient-to-br from-slate-950/80 via-emerald-950/60 to-teal-900/40"
            : "border-amber-300/40 bg-gradient-to-br from-slate-950/80 via-amber-950/60 to-rose-900/40"
      : theme === "sunset"
        ? temperamentKey === "NT"
          ? "border-sky-300/40 bg-gradient-to-br from-slate-950/80 via-indigo-950/60 to-sky-900/40"
          : temperamentKey === "NF"
            ? "border-rose-300/40 bg-gradient-to-br from-slate-950/80 via-rose-950/60 to-fuchsia-900/40"
            : temperamentKey === "SJ"
              ? "border-amber-300/40 bg-gradient-to-br from-slate-950/80 via-amber-950/60 to-orange-900/40"
              : "border-emerald-300/40 bg-gradient-to-br from-slate-950/80 via-emerald-950/60 to-teal-900/40"
        : temperamentKey === "NT"
          ? "border-sky-200/40 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-sky-900/40"
          : temperamentKey === "NF"
            ? "border-violet-200/40 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-violet-900/40"
            : temperamentKey === "SJ"
              ? "border-zinc-200/40 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-emerald-900/40"
              : "border-amber-200/40 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-amber-900/40";

  const codeGradient = (() => {
    const e = profile.code[0];
    const nOrS = profile.code[1];
    const tOrF = profile.code[2];
    if (e === "E" && tOrF === "T") {
      return "bg-gradient-to-r from-amber-300 via-orange-300 to-sky-300";
    }
    if (e === "E" && tOrF === "F") {
      return "bg-gradient-to-r from-rose-300 via-pink-300 to-amber-300";
    }
    if (e === "I" && nOrS === "N") {
      return "bg-gradient-to-r from-violet-300 via-indigo-300 to-sky-300";
    }
    return "bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300";
  })();

  const repsColor =
    profile.code[2] === "T"
      ? theme === "sunset"
        ? "text-sky-300"
        : "text-cyan-300"
      : theme === "sunset"
        ? "text-fuchsia-300"
        : "text-violet-300";
 
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
      className={`group relative flex h-full flex-col justify-between rounded-[2rem] border bg-clip-padding p-6 text-left shadow-xl backdrop-blur-2xl transition ${cardStyle} hover:brightness-110 overflow-hidden`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="relative z-10 flex flex-col pr-20 md:pr-24">
            <h3
              className={`font-serif text-3xl font-semibold tracking-tight text-transparent ${codeGradient} bg-clip-text`}
            >
              {profile.code}
            </h3>
            <p className="mt-1 text-sm font-medium text-zinc-100">
              {profile.name}
            </p>
            <p className={`mt-1 text-xs ${repsColor}`}>
              {reps}
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 select-none z-0">
          <span className="block leading-none drop-shadow-lg text-[clamp(40px,6vw,72px)]">{emoji}</span>
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
