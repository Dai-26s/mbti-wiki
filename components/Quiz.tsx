
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RadarChart from "./RadarChart";
import QuestionIllustration from "./QuestionIllustration";
import { mbtiProfiles, type MbtiProfile } from "../data/mbti";
import { quickQuestions, fullQuestions, type Question } from "../data/quiz-data";

type QuizResult = {
  code: string;
  scores: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
  percentages: {
    EI: number; // Percentage of First pole (E)
    SN: number; // Percentage of First pole (S)
    TF: number; // Percentage of First pole (T)
    JP: number; // Percentage of First pole (J)
  };
};

interface QuizProps {
  onViewDetail: (code: string) => void;
  onBackToGallery: () => void;
  theme: "aurora" | "sunset" | "mono" | "light";
}

const scaleOptions = [
  { value: 1, label: "非常不同意" },
  { value: 2, label: "不同意" },
  { value: 3, label: "中立" },
  { value: 4, label: "同意" },
  { value: 5, label: "非常同意" },
];

function calculateResult(answers: number[], questions: Question[]): QuizResult {
  const initialScores = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  const counts = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  const scores = answers.reduce((acc, answer, index) => {
    const question = questions[index];
    if (!question) {
      return acc;
    }
    
    // Count questions per dimension
    counts[question.dimension]++;

    const centered = answer - 3;
    if (centered === 0) {
      return acc;
    }
    const sign = question.target === "first" ? 1 : -1;
    const delta = centered * sign;
    return {
      ...acc,
      [question.dimension]: acc[question.dimension] + delta,
    };
  }, initialScores);

  // Calculate percentages (0-100 for the First pole)
  // Max score per dimension = count * 2
  // We need to divide counts by 2 or something?
  // Wait, counts[dim] is total questions for that dimension.
  // We are iterating answers which maps 1:1 to questions used.
  // So counts[dim] will be the total number of questions for that dimension in the current quiz.
  
  const percentages = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  (Object.keys(scores) as Array<keyof typeof scores>).forEach((dim) => {
    const maxScore = counts[dim] * 2;
    if (maxScore === 0) {
      percentages[dim] = 50;
    } else {
      percentages[dim] = Math.round(50 + (scores[dim] / maxScore) * 50);
    }
  });

  const code =
    (scores.EI >= 0 ? "E" : "I") +
    (scores.SN >= 0 ? "S" : "N") +
    (scores.TF >= 0 ? "T" : "F") +
    (scores.JP >= 0 ? "J" : "P");

  return { code, scores, percentages };
}

function getProfileSummary(code: string): { profile: MbtiProfile | null; summary: string | null } {
  const profile = mbtiProfiles.find((item) => item.code === code) ?? null;
  if (!profile) {
    return { profile: null, summary: null };
  }
  const parts = profile.description.split("。").filter((item) => item.trim().length > 0);
  const firstSentence = parts[0] ? `${parts[0]}。` : profile.description;
  return { profile, summary: firstSentence };
}

export default function Quiz({ onViewDetail, onBackToGallery, theme }: QuizProps) {
  const [quizMode, setQuizMode] = useState<"selection" | "quick" | "full">("selection");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<QuizResult | null>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const startQuiz = (mode: "quick" | "full") => {
    setQuizMode(mode);
    setQuestions(mode === "quick" ? quickQuestions : fullQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    setDirection(1);
    setIsTransitioning(false);
  };

  const isCompleted = useMemo(() => result !== null, [result]);

  const progress = isCompleted
    ? 1
    : questions.length > 0 
      ? (currentIndex + (answers[currentIndex] ? 1 : 0)) / questions.length
      : 0;

  const handleSelect = (value: number) => {
    if (isCompleted || isTransitioning) {
      return;
    }
    
    // Optimistic update for visual feedback
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = value;
    setAnswers(nextAnswers);
    setIsTransitioning(true);

    // Delay for 400ms to show the selected effect
    setTimeout(() => {
        if (currentIndex === questions.length - 1) {
            const computed = calculateResult(nextAnswers, questions);
            setResult(computed);
        } else {
            setDirection(1);
            setCurrentIndex((index) => index + 1);
        }
        setIsTransitioning(false);
    }, 400);
  };

  const handlePrev = () => {
    if (isCompleted || isTransitioning) {
      return;
    }
    if (currentIndex === 0) {
      return;
    }
    setDirection(-1);
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleViewDetail = () => {
    if (!result) {
      return;
    }
    onViewDetail(result.code);
  };

  const isLight = theme === "light";

  // Selection Screen
  if (quizMode === "selection") {
    return (
      <div
        className={`flex h-full flex-col rounded-3xl p-5 shadow-2xl sm:p-7 ${
          isLight
            ? "border border-zinc-200 bg-white/80"
            : "border border-white/15 bg-white/5 backdrop-blur-2xl"
        }`}
      >
         <div
          className={`mb-6 flex items-center justify-between text-xs ${
            isLight ? "text-zinc-700" : "text-zinc-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400" />
            <span>开始测评</span>
          </div>
          <button
            type="button"
            onClick={onBackToGallery}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium shadow-sm transition ${
              isLight
                ? "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                : "border border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            返回人格图鉴
          </button>
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="text-center space-y-2">
            <h2
              className={`text-2xl font-semibold ${
                isLight ? "text-zinc-900" : "text-zinc-50"
              }`}
            >
              选择测评模式
            </h2>
            <p
              className={`text-sm ${
                isLight ? "text-zinc-700" : "text-zinc-400"
              }`}
            >
              请根据你的时间安排选择合适的测评深度
            </p>
          </div>
          
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <button
              onClick={() => startQuiz("quick")}
              className={`group relative flex flex-col items-start gap-4 rounded-3xl border p-6 text-left transition ${
                isLight
                  ? "border-zinc-200 bg-white hover:bg-zinc-50"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="absolute right-6 top-6 rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400">
                推荐
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-400/20 p-3 text-emerald-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold group-hover:text-zinc-900 ${
                    isLight ? "text-zinc-900" : "text-zinc-100 group-hover:text-white"
                  }`}
                >
                  快速测评
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    isLight ? "text-zinc-700" : "text-zinc-400"
                  }`}
                >
                  30 道精选题 · 约 3 分钟
                </p>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isLight
                    ? "text-zinc-700"
                    : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              >
                覆盖四个核心维度的简易版测试，适合快速了解自己的人格大概倾向。
              </p>
            </button>

            <button
              onClick={() => startQuiz("full")}
              className={`group relative flex flex-col items-start gap-4 rounded-3xl border p-6 text-left transition ${
                isLight
                  ? "border-zinc-200 bg-white hover:bg-zinc-50"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className="rounded-2xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 p-3 text-violet-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold group-hover:text-zinc-900 ${
                    isLight ? "text-zinc-900" : "text-zinc-100 group-hover:text-white"
                  }`}
                >
                  深度测评
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    isLight ? "text-zinc-700" : "text-zinc-400"
                  }`}
                >
                  80 道完整题 · 约 12 分钟
                </p>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isLight
                    ? "text-zinc-700"
                    : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              >
                基于 MBTI 完整理论模型的深度分析，结果更加精准，包含详细的倾向比例。
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-5 shadow-2xl sm:p-7 ${
        isLight
          ? "border border-zinc-200 bg-white/80"
          : "border border-white/15 bg-white/5 backdrop-blur-2xl"
      }`}
    >
      <div
        className={`mb-6 flex items-center justify-between text-xs ${
          isLight ? "text-zinc-700" : "text-zinc-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400" />
          <span>{quizMode === "quick" ? "快速测评" : "深度测评"}</span>
        </div>
        <div className="flex items-center gap-3">
          <div>
            {isCompleted
              ? `${questions.length} / ${questions.length}`
              : `${currentIndex + 1} / ${questions.length}`}
          </div>
          <button
            type="button"
            onClick={onBackToGallery}
            className={`hidden rounded-full px-3 py-1 text-[11px] font-medium shadow-sm transition sm:inline-flex sm:items-center ${
              isLight
                ? "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                : "border border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            返回人格图鉴
          </button>
        </div>
      </div>
      <div
        className={`mb-6 h-2 w-full overflow-hidden rounded-full ${
          isLight ? "bg-zinc-200" : "bg-zinc-800/80"
        }`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        />
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {!isCompleted && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              className="flex h-full flex-col justify-between"
              initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="md:grid md:grid-cols-12 md:gap-8">
                <div className="md:col-span-7">
                  <div className="space-y-3">
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.16em] ring-1 ${
                        isLight
                          ? "bg-zinc-100 text-zinc-800 ring-zinc-200"
                          : "bg-white/5 text-zinc-300 ring-white/10"
                      }`}
                    >
                      Q{currentIndex + 1}
                    </div>
                    <h2
                      className={`text-base font-normal tracking-[0.01em] leading-relaxed sm:text-lg ${
                        isLight ? "text-zinc-900" : "text-zinc-50"
                      }`}
                    >
                      {currentQuestion.text}
                    </h2>
                    <p
                      className={`text-xs ${
                        isLight ? "text-zinc-700" : "text-zinc-400"
                      }`}
                    >
                      请根据你在大多数场景中的真实反应作答，而不是理想中的自己。
                    </p>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="grid gap-2 sm:grid-cols-5">
                      {scaleOptions.map((option) => {
                        const selected = answers[currentIndex] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`flex items-center justify-center rounded-2xl px-3 py-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 ${
                              selected
                                ? "bg-gradient-to-br from-sky-500 to-emerald-400 text-zinc-50 shadow-lg shadow-sky-900/40"
                                : isLight
                                  ? "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                                  : "bg-white/5 text-zinc-200 hover:bg-white/10"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                          currentIndex === 0
                            ? isLight
                              ? "cursor-not-allowed border-zinc-200 bg-transparent text-zinc-500"
                              : "cursor-not-allowed border-white/10 bg-white/0 text-zinc-500"
                            : isLight
                              ? "border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                              : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        上一题
                      </button>
                      <div
                        className={`text-[11px] ${
                          isLight ? "text-zinc-700" : "text-zinc-500"
                        }`}
                      >
                        已选择的选项会保留，可随时返回修改
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 md:mt-0 md:col-span-5">
                  <QuestionIllustration
                    question={currentQuestion}
                    theme={theme}
                  />
                </div>
              </div>
            </motion.div>
          )}
          {isCompleted && result && (
            <motion.div
              key={result.code}
              className="flex h-full flex-col justify-between"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              {/* Result Card */}
              <div
                className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8 ${
                  isLight
                    ? "bg-white ring-1 ring-zinc-200"
                    : "bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10"
                }`}
              >
                {/* Decorative Background */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
                   {/* Left: Info */}
                   <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                            isLight
                              ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                              : "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          测评完成
                        </div>
                        <h1
                          className={`text-5xl font-bold tracking-tight sm:text-6xl ${
                            isLight ? "text-zinc-900" : "text-white"
                          }`}
                        >
                          {result.code}
                        </h1>
                        {(() => {
                           const { summary, profile } = getProfileSummary(result.code);
                           return (
                             <div className="space-y-4">
                               <h2
                                 className={`text-xl font-medium ${
                                   isLight ? "text-zinc-900" : "text-zinc-200"
                                 }`}
                               >
                                 {profile?.name || "未知类型"}
                               </h2>
                               {profile?.strengths && (
                                 <div className="flex flex-wrap gap-2">
                                   {profile.strengths.slice(0, 3).map(s => (
                                     <span
                                       key={s}
                                       className={`rounded-md px-2.5 py-1 text-[11px] ring-1 ${
                                         isLight
                                           ? "bg-zinc-100 text-zinc-800 ring-zinc-200"
                                           : "bg-white/5 text-zinc-300 ring-white/10"
                                       }`}
                                     >
                                       {s}
                                     </span>
                                   ))}
                                 </div>
                               )}
                               <p
                                 className={`text-sm leading-relaxed ${
                                   isLight ? "text-zinc-700" : "text-zinc-300/90"
                                 }`}
                               >
                                 {summary}
                               </p>
                             </div>
                           );
                        })()}
                      </div>
                      
                      {/* Share Hint */}
                      <div
                        className={`flex items-center gap-4 text-xs ${
                          isLight ? "text-zinc-700" : "text-zinc-500"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>截图分享结果</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <span>长按保存卡片</span>
                      </div>
                   </div>

                   {/* Right: Radar Chart */}
                   <div className="flex flex-col items-center justify-center py-4 md:py-0">
                      <div className="relative">
                        <RadarChart 
                            data={result.percentages} 
                            size={240} 
                            className="text-zinc-200"
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onBackToGallery}
                  className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition ${
                    isLight
                      ? "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  返回图鉴
                </button>
                <button
                  type="button"
                  onClick={handleViewDetail}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-400 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80"
                >
                  查看完整解析
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
