"use client";

import { motion } from "framer-motion";
import type { MbtiProfile } from "../data/mbti";

interface MbtiCardProps {
  profile: MbtiProfile;
  onClick: () => void;
  theme: "aurora" | "sunset" | "mono" | "light";
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

  const codeTintMap: Record<string, string> = {
    INTJ: "bg-indigo-300/20",
    INTP: "bg-sky-300/20",
    ENTJ: "bg-amber-300/20",
    ENTP: "bg-cyan-300/20",
    INFJ: "bg-violet-300/20",
    INFP: "bg-rose-300/20",
    ENFJ: "bg-fuchsia-300/20",
    ENFP: "bg-orange-300/20",
    ISTJ: "bg-emerald-300/20",
    ISFJ: "bg-teal-300/20",
    ESTJ: "bg-blue-300/20",
    ESFJ: "bg-pink-300/20",
    ISTP: "bg-slate-300/20",
    ISFP: "bg-lime-300/20",
    ESTP: "bg-cyan-300/20",
    ESFP: "bg-amber-300/20",
  };

  const cardStyle =
    theme === "aurora"
      ? temperamentKey === "NT"
        ? "border-sky-200/30 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-zinc-900/70"
        : temperamentKey === "NF"
          ? "border-violet-200/30 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-zinc-900/70"
          : temperamentKey === "SJ"
            ? "border-emerald-200/30 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-zinc-900/70"
            : "border-amber-200/30 bg-gradient-to-br from-zinc-950/90 via-slate-900/80 to-zinc-900/70"
      : theme === "sunset"
        ? temperamentKey === "NT"
          ? "border-sky-200/25 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70"
          : temperamentKey === "NF"
            ? "border-rose-200/25 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70"
            : temperamentKey === "SJ"
              ? "border-amber-200/25 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70"
              : "border-emerald-200/25 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/70"
        : temperamentKey === "NT"
          ? "border-sky-100/25 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-900/70"
          : temperamentKey === "NF"
            ? "border-violet-100/25 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-900/70"
            : temperamentKey === "SJ"
              ? "border-zinc-200/25 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-900/70"
              : "border-amber-100/25 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-900/70";
  const finalCardStyle =
    theme === "light"
      ? "border-zinc-200 bg-white/70"
      : cardStyle;

  const repsColor =
    profile.code[2] === "T"
      ? theme === "sunset"
        ? "text-sky-200/80"
        : "text-cyan-200/80"
      : theme === "sunset"
        ? "text-fuchsia-200/80"
        : "text-violet-200/80";
 
  const emoji = getAvatarEmoji(profile.code);
  const cleanRep = (t: string) =>
    t.replace(/^(虚构：|文化：)/, "").replace(/（[^）]*）/g, "").trim();
  const reps =
    profile.representatives && profile.representatives.length > 0
      ? profile.representatives.slice(0, 3).map(cleanRep).join("、")
      : "";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex h-full flex-col justify-between rounded-[2rem] border bg-clip-padding p-6 md:p-7 text-left shadow-xl backdrop-blur-2xl transition ${finalCardStyle} hover:brightness-110 hover:shadow-2xl hover:ring-1 hover:ring-white/30 overflow-hidden`}
    >
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${codeTintMap[profile.code]} opacity-30`} />
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="relative z-10 flex flex-col pr-20 md:pr-24">
            <h3
              className={`font-serif text-3xl md:text-4xl font-semibold tracking-tight ${theme === "light" ? "text-zinc-900" : "text-white"}`}
            >
              {profile.code}
            </h3>
            <p className={`mt-1 text-sm font-medium ${theme === "light" ? "text-zinc-700" : "text-zinc-200/80"}`}>
              {profile.name}
            </p>
            <p className={`mt-1 text-xs ${theme === "light" ? "text-zinc-600" : repsColor}`}>
              {reps}
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute right-4 top-4 select-none z-0">
          <span className="block leading-none text-[clamp(40px,6vw,72px)] opacity-40 md:opacity-50">
            {emoji}
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
        <span
          className={`flex items-center gap-2 ${
            theme === "light" ? "text-zinc-700" : "text-zinc-300"
          }`}
        >
          <span className={`inline-flex h-1.5 w-1.5 rounded-full ${accentDot} group-hover:scale-125 transition-transform`} />
          查看详情
        </span>
        <div className="flex -space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
            <svg
              className={`w-4 h-4 ${
                theme === "light" ? "text-zinc-600" : "text-zinc-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
        </div>
      </div>
    </motion.button>
  );
}
