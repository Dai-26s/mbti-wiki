"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MbtiCard from "../components/MbtiCard";
import { mbtiProfiles, type MbtiProfile } from "../data/mbti";
import Quiz from "../components/Quiz";

type AppTheme = "aurora" | "sunset" | "mono" | "light";

export default function Home() {
  const [currentView, setCurrentView] = useState<"gallery" | "quiz">("gallery");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MbtiProfile | null>(
    null,
  );
  const [theme, setTheme] = useState<AppTheme>("light");
  const [activeLetters, setActiveLetters] = useState<string[]>([]);

  const themeConfig: Record<
    AppTheme,
    {
      pageBg: string;
      pageText: string;
      titleText: string;
      bodyText: string;
      accentDot: string;
      pillBg: string;
      pillRing: string;
      modalBg: string;
      modalText: string;
      detailPrimaryText: string;
      detailSecondaryText: string;
    }
  > = {
    aurora: {
      pageBg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900",
      pageText: "text-zinc-50",
      titleText: "text-zinc-50",
      bodyText: "text-zinc-300",
      accentDot: "bg-gradient-to-tr from-sky-400 to-emerald-400",
      pillBg: "bg-white/5",
      pillRing: "ring-white/15",
      modalBg: "bg-zinc-950/90",
      modalText: "text-zinc-50",
      detailPrimaryText: "text-zinc-100",
      detailSecondaryText: "text-zinc-300",
    },
    sunset: {
      pageBg: "bg-gradient-to-br from-slate-950 via-violet-950 to-rose-900",
      pageText: "text-zinc-50",
      titleText: "text-zinc-50",
      bodyText: "text-zinc-300",
      accentDot: "bg-gradient-to-tr from-rose-400 to-amber-300",
      pillBg: "bg-white/5",
      pillRing: "ring-white/20",
      modalBg: "bg-slate-950/90",
      modalText: "text-zinc-50",
      detailPrimaryText: "text-zinc-100",
      detailSecondaryText: "text-zinc-300",
    },
    mono: {
      pageBg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800",
      pageText: "text-zinc-50",
      titleText: "text-zinc-50",
      bodyText: "text-zinc-300",
      accentDot: "bg-zinc-200",
      pillBg: "bg-white/5",
      pillRing: "ring-white/10",
      modalBg: "bg-zinc-950/95",
      modalText: "text-zinc-50",
      detailPrimaryText: "text-zinc-100",
      detailSecondaryText: "text-zinc-300",
    },
    light: {
      pageBg: "bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100",
      pageText: "text-zinc-900",
      titleText: "text-zinc-900",
      bodyText: "text-zinc-700",
      accentDot: "bg-zinc-900",
      pillBg: "bg-zinc-100",
      pillRing: "ring-zinc-200",
      modalBg: "bg-white/95",
      modalText: "text-zinc-900",
      detailPrimaryText: "text-zinc-900",
      detailSecondaryText: "text-zinc-700",
    },
  };

  const styles = themeConfig[theme];

  const letterFilters = [
    "I",
    "E",
    "N",
    "S",
    "T",
    "F",
    "J",
    "P",
  ];

  const orderedProfiles = useMemo(() => {
    const orderEI = ["I", "E"];
    const orderSN = ["N", "S"];
    const orderTF = ["T", "F"];
    const orderJP = ["J", "P"];

    const score = (code: string) => {
      const [e, s, t, j] = code.split("");
      return [
        orderEI.indexOf(e),
        orderSN.indexOf(s),
        orderTF.indexOf(t),
        orderJP.indexOf(j),
      ];
    };

    const list = [...mbtiProfiles];
    list.sort((a, b) => {
      const sa = score(a.code);
      const sb = score(b.code);
      for (let i = 0; i < sa.length; i += 1) {
        if (sa[i] !== sb[i]) return sa[i] - sb[i];
      }
      return 0;
    });

    if (activeLetters.length === 0) return list;
    return list.filter((profile) =>
      activeLetters.every((ch) => profile.code.includes(ch)),
    );
  }, [activeLetters]);

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

  const detailSurface: Record<string, { avatar: string }> = {
    INTJ: { avatar: "bg-gradient-to-br from-slate-900 via-indigo-900/70 to-slate-800" },
    INTP: { avatar: "bg-gradient-to-br from-slate-900 via-sky-900/60 to-slate-800" },
    ENTJ: { avatar: "bg-gradient-to-br from-slate-900 via-amber-900/60 to-slate-800" },
    ENTP: { avatar: "bg-gradient-to-br from-slate-900 via-emerald-900/60 to-slate-800" },
    INFJ: { avatar: "bg-gradient-to-br from-slate-900 via-violet-900/60 to-slate-800" },
    INFP: { avatar: "bg-gradient-to-br from-slate-900 via-rose-900/60 to-slate-800" },
    ENFJ: { avatar: "bg-gradient-to-br from-slate-900 via-fuchsia-900/60 to-slate-800" },
    ENFP: { avatar: "bg-gradient-to-br from-slate-900 via-orange-900/60 to-slate-800" },
    ISTJ: { avatar: "bg-gradient-to-br from-slate-900 via-emerald-900/60 to-slate-800" },
    ISFJ: { avatar: "bg-gradient-to-br from-slate-900 via-teal-900/60 to-slate-800" },
    ESTJ: { avatar: "bg-gradient-to-br from-slate-900 via-blue-900/60 to-slate-800" },
    ESFJ: { avatar: "bg-gradient-to-br from-slate-900 via-pink-900/60 to-slate-800" },
    ISTP: { avatar: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" },
    ISFP: { avatar: "bg-gradient-to-br from-slate-900 via-lime-900/40 to-slate-800" },
    ESTP: { avatar: "bg-gradient-to-br from-slate-900 via-cyan-900/60 to-slate-800" },
    ESFP: { avatar: "bg-gradient-to-br from-slate-900 via-amber-900/60 to-slate-800" },
  };

  return (
    <div className={`min-h-screen ${styles.pageBg} ${styles.pageText}`}>
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
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles.pillBg} ${styles.pillRing} ${
                      theme === "light" ? "text-zinc-800" : "text-zinc-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${styles.accentDot}`}
                    />
                    MBTI 人格图鉴
                  </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${styles.titleText}`}>
                        认识 16 种人格，找到更适合自己的路
                      </h1>
                      <p className={`mt-2 max-w-xl text-sm ${styles.bodyText}`}>
                        点击右侧卡片，查看每一种人格的核心特质、典型习惯、代表人物与成长建议。
                      </p>
                    </div>
                    <div
                      className={`mt-2 flex flex-wrap gap-2 text-[11px] sm:justify-end ${
                        theme === "light" ? "text-zinc-700" : "text-zinc-300"
                      }`}
                    >
                      <span
                        className={`mr-1 ${
                          theme === "light" ? "text-zinc-800" : "text-zinc-400"
                        }`}
                      >
                        筛选倾向：
                      </span>
                      {letterFilters.map((letter) => {
                        const active = activeLetters.includes(letter);
                        return (
                          <button
                            key={letter}
                            type="button"
                            onClick={() =>
                              setActiveLetters((prev) =>
                                prev.includes(letter)
                                  ? prev.filter((l) => l !== letter)
                                  : [...prev, letter],
                              )
                            }
                            className={`rounded-full px-2.5 py-1 transition ${
                              active
                                ? theme === "light"
                                  ? "bg-zinc-900 text-zinc-50"
                                  : "bg-white/20 text-zinc-50"
                                : theme === "light"
                                  ? "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                      {activeLetters.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveLetters([])}
                          className={`rounded-full px-2 py-1 text-[10px] underline-offset-2 hover:underline ${
                            theme === "light"
                              ? "text-zinc-700 hover:text-zinc-900"
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          重置
                        </button>
                      )}
                    </div>
                  </div>
                </header>
                <section className="mt-4">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:gap-8">
                    {orderedProfiles.map((profile) => (
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
                  theme={theme}
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
          <div className="w-3" />
          <button
            type="button"
            onClick={() => setShowMobileMenu(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>更多</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="text-lg font-semibold text-zinc-50">菜单 & 设置</span>
                <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="rounded-full bg-white/10 p-2 text-zinc-300 transition hover:bg-white/20 hover:text-white"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                <Sidebar
                    activeView={currentView}
                    onChangeView={(view) => {
                        setCurrentView(view);
                        setShowMobileMenu(false);
                    }}
                    theme={theme}
                    onChangeTheme={setTheme}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className={`relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8 ${styles.modalBg} ${styles.modalText}`}
              initial={{ y: 40, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${detailSurface[selectedProfile.code]?.avatar ?? "bg-slate-800"} text-3xl shadow-lg`}>
                    <span>{getAvatarEmoji(selectedProfile.code)}</span>
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles.pillBg} ${styles.pillRing} ${
                        theme === "light" ? "text-zinc-800" : "text-zinc-200"
                      }`}
                    >
                      <span
                        className={`text-[10px] uppercase tracking-[0.15em] ${
                          theme === "light" ? "text-zinc-700" : "text-zinc-300"
                        }`}
                      >
                        MBTI CODE
                      </span>
                    </div>
                    <h2
                      className={`font-serif text-3xl font-bold tracking-tight sm:text-4xl ${
                        theme === "light" ? "text-zinc-900" : "text-zinc-50"
                      }`}
                    >
                      {selectedProfile.code}
                    </h2>
                    <p
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-zinc-700" : "text-zinc-400"
                      }`}
                    >
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
                      <p className={`text-[13px] leading-relaxed ${styles.detailPrimaryText}`}>
                        {parts[0]}。
                      </p>
                      {parts.slice(1).map((part) => (
                        <p
                          key={part}
                          className={`text-xs leading-relaxed ${styles.detailSecondaryText}`}
                        >
                          {part}。
                        </p>
                      ))}
                    </div>
                  );
                })()}
                <div className="space-y-2">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-zinc-900" : "text-zinc-100"
                    }`}
                  >
                    常见习惯
                  </h3>
                  <ul
                    className={`space-y-1.5 text-sm ${
                      theme === "light" ? "text-zinc-700" : "text-zinc-300"
                    }`}
                  >
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
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-zinc-900" : "text-zinc-100"
                    }`}
                  >
                    代表人物
                  </h3>
                  <ul
                    className={`space-y-1.5 text-sm ${
                      theme === "light" ? "text-zinc-700" : "text-zinc-300"
                    }`}
                  >
                    {selectedProfile.representatives.map((rep) => (
                      <li key={rep} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400" />
                        <span>{rep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-zinc-900" : "text-zinc-100"
                    }`}
                  >
                    成长建议
                  </h3>
                  <ul
                    className={`space-y-1.5 text-sm ${
                      theme === "light" ? "text-zinc-700" : "text-zinc-300"
                    }`}
                  >
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
