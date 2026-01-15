"use client";

import { motion } from "framer-motion";
import type { MbtiProfile } from "../data/mbti";

interface MbtiCardProps {
  profile: MbtiProfile;
  onClick: () => void;
  theme: "aurora" | "sunset" | "mono";
}

export default function MbtiCard({ profile, onClick, theme }: MbtiCardProps) {
  const avatarBg =
    theme === "aurora"
      ? "bg-gradient-to-br from-sky-500 via-emerald-400 to-cyan-400"
      : theme === "sunset"
        ? "bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300"
        : "bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-700";

  const accentDot =
    theme === "aurora"
      ? "bg-gradient-to-tr from-sky-400 to-emerald-400"
      : theme === "sunset"
        ? "bg-gradient-to-tr from-rose-400 to-amber-300"
        : "bg-zinc-200";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-white/10 bg-clip-padding p-5 text-left shadow-lg backdrop-blur-2xl transition hover:border-white/25 hover:bg-white/15 dark:border-zinc-700/70 dark:bg-zinc-900/70"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-zinc-950 shadow-lg ${avatarBg}`}
          >
            <span>{profile.code}</span>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-zinc-200 ring-1 ring-white/10">
              <span
                className={`h-1.5 w-1.5 rounded-full ${accentDot}`}
              />
              <span className="uppercase tracking-[0.18em]">MBTI</span>
            </div>
            <div className="text-sm font-semibold text-zinc-50 sm:text-base">
              {profile.name}
            </div>
          </div>
        </div>
        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-zinc-300">
          {profile.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-300">
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex h-1.5 w-1.5 rounded-full ${accentDot}`}
          />
          查看人格详情
        </span>
        <span className="text-[11px] text-zinc-400 transition group-hover:text-zinc-200">
          点击展开
        </span>
      </div>
    </motion.button>
  );
}
