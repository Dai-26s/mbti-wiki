"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MbtiCard from "../components/MbtiCard";
import { mbtiProfiles, type MbtiProfile } from "../data/mbti";
import Quiz from "../components/Quiz";

type AppTheme = "aurora" | "sunset" | "mono";

export default function Home() {
  const [currentView, setCurrentView] = useState<"gallery" | "quiz">("gallery");
  const [selectedProfile, setSelectedProfile] = useState<MbtiProfile | null>(
    null,
  );
  const [theme, setTheme] = useState<AppTheme>("aurora");

  const themeConfig: Record<
    AppTheme,
    {
      pageBg: string;
      accentDot: string;
      pillBg: string;
      pillRing: string;
      modalBg: string;
    }
  > = {
    aurora: {
      pageBg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900",
      accentDot: "bg-gradient-to-tr from-sky-400 to-emerald-400",
      pillBg: "bg-white/5",
      pillRing: "ring-white/15",
      modalBg: "bg-zinc-950/90",
    },
    sunset: {
      pageBg: "bg-gradient-to-br from-slate-950 via-violet-950 to-rose-900",
      accentDot: "bg-gradient-to-tr from-rose-400 to-amber-300",
      pillBg: "bg-white/5",
      pillRing: "ring-white/20",
      modalBg: "bg-slate-950/90",
    },
    mono: {
      pageBg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800",
      accentDot: "bg-zinc-200",
      pillBg: "bg-white/5",
      pillRing: "ring-white/10",
      modalBg: "bg-zinc-950/95",
    },
  };

  const styles = themeConfig[theme];

  const handleOpen = (profile: MbtiProfile) => {
    setSelectedProfile(profile);
  };

  const handleViewDetailFromQuiz = (code: string) => {
    const profile = mbtiProfiles.find((item) => item.code === code);
    if (!profile) {
      return;
    }
    setSelectedProfile(profile);
    setCurrentView("gallery");
  };

  const handleClose = () => {
    setSelectedProfile(null);
  };

  const getAvatarEmoji = (code: string) => {
    const map: Record<string, string> = {
      INTJ: "📐", INTP: "🧪", ENTJ: "🎬", ENTP: "🗣️",
      INFJ: "🕯️", INFP: "🍃", ENFJ: "⚔️", ENFP: "🎉",
      ISTJ: "📋", ISFJ: "🛡️", ESTJ: "⚖️", ESFJ: "🤝",
      ISTP: "🔧", ISFP: "🎨", ESTP: "🚀", ESFP: "🎤",
    };
    return map[code] || "🧩";
  };

  const avatarBg =
    theme === "aurora"
      ? "bg-gradient-to-br from-sky-500 via-emerald-400 to-cyan-400"
      : theme === "sunset"
        ? "bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300"
        : "bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-700";

  return (
    <div className={`min-h-screen ${styles.pageBg} text-zinc-50`}>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:gap-10 md:px-8 md:py-10 lg:py-12">
        <div className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 md:block">
          <Sidebar
            activeView={currentView}
            onChangeView={setCurrentView}
            theme={theme}
            onChangeTheme={setTheme}
          />
        </div>
        <main className="flex flex-1 flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === "gallery" ? (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <header className="space-y-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-zinc-200 ring-1 ${styles.pillBg} ${styles.pillRing}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${styles.accentDot}`}
                    />
                    MBTI 人格图鉴
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                        认识 16 种人格，找到更适合自己的路
                      </h1>
                      <p className="mt-2 max-w-xl text-sm text-zinc-300">
                        点击右侧卡片，查看每一种人格的核心特质、典型习惯、代表人物与成长建议。
                      </p>
                    </div>
                  </div>
                </header>
                <section className="mt-4">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-6">
                    {mbtiProfiles.map((profile) => (
                      <MbtiCard
                        key={profile.code}
                        profile={profile}
                        onClick={() => handleOpen(profile)}
                        theme={theme}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-2 h-full"
              >
                <Quiz
                  onViewDetail={handleViewDetailFromQuiz}
                  onBackToGallery={() => setCurrentView("gallery")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView("gallery")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
              currentView === "gallery"
                ? "bg-white/10 text-zinc-50 ring-1 ring-white/20"
                : "bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400" />
            <span>人格图鉴</span>
          </button>
          <div className="w-3" />
          <button
            type="button"
            onClick={() => setCurrentView("quiz")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
              currentView === "quiz"
                ? "bg-white/10 text-zinc-50 ring-1 ring-white/20"
                : "bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>人格测评</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            key={selectedProfile.code}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className={`relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/15 p-6 text-zinc-50 shadow-2xl sm:p-8 ${styles.modalBg}`}
              initial={{ y: 40, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${avatarBg} text-3xl shadow-lg`}>
                    <span>{getAvatarEmoji(selectedProfile.code)}</span>
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-zinc-200 ring-1 ${styles.pillBg} ${styles.pillRing}`}
                    >
                      <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-300">
                        MBTI CODE
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
                      {selectedProfile.code}
                    </h2>
                    <p className="text-sm font-medium text-zinc-400">
                      {selectedProfile.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="mt-5 space-y-6 overflow-y-auto pr-1 text-sm leading-relaxed sm:pr-2">
                {(() => {
                  const parts = selectedProfile.description
                    .split("。")
                    .filter((item) => item.trim().length > 0);
                  if (parts.length === 0) {
                    return null;
                  }
                  return (
                    <div className="space-y-2">
                      <p className="text-[13px] leading-relaxed text-zinc-100">
                        {parts[0]}。
                      </p>
                      {parts.slice(1).map((part) => (
                        <p
                          key={part}
                          className="text-xs leading-relaxed text-zinc-300"
                        >
                          {part}。
                        </p>
                      ))}
                    </div>
                  );
                })()}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">
                    常见习惯
                  </h3>
                  <ul className="space-y-1.5 text-sm text-zinc-300">
                    {selectedProfile.habits.map((habit) => (
                      <li key={habit} className="flex gap-2">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 rounded-full ${styles.accentDot}`}
                        />
                        <span>{habit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">
                    代表人物
                  </h3>
                  <ul className="space-y-1.5 text-sm text-zinc-300">
                    {selectedProfile.representatives.map((rep) => (
                      <li key={rep} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span>{rep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-100">
                    成长建议
                  </h3>
                  <ul className="space-y-1.5 text-sm text-zinc-300">
                    {selectedProfile.suggestions.map((suggestion) => (
                      <li key={suggestion} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
