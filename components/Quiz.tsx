
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

export default function Quiz({ onViewDetail, onBackToGallery }: QuizProps) {
  const [quizMode, setQuizMode] = useState<"selection" | "quick" | "full">("selection");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = (mode: "quick" | "full") => {
    setQuizMode(mode);
    setQuestions(mode === "quick" ? quickQuestions : fullQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    setDirection(1);
  };

  const isCompleted = useMemo(() => result !== null, [result]);

  const progress = isCompleted
    ? 1
    : questions.length > 0 
      ? (currentIndex + (answers[currentIndex] ? 1 : 0)) / questions.length
      : 0;

  const handleSelect = (value: number) => {
    if (isCompleted) {
      return;
    }
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = value;
    setAnswers(nextAnswers);

    if (currentIndex === questions.length - 1) {
      const computed = calculateResult(nextAnswers, questions);
      setResult(computed);
    } else {
      setDirection(1);
      setCurrentIndex((index) => index + 1);
    }
  };

  const handlePrev = () => {
    if (isCompleted) {
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

  // Selection Screen
  if (quizMode === "selection") {
    return (
      <div className="flex h-full flex-col rounded-3xl border border-white/15 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
         <div className="mb-6 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400" />
            <span>开始测评</span>
          </div>
          <button
            type="button"
            onClick={onBackToGallery}
            className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-200 shadow-sm transition hover:bg-white/10 hover:text-white inline-flex items-center"
          >
            返回人格图鉴
          </button>
        </div>
        
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-50">选择测评模式</h2>
            <p className="text-sm text-zinc-400">请根据你的时间安排选择合适的测评深度</p>
          </div>
          
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <button
              onClick={() => startQuiz("quick")}
              className="group relative flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10 hover:border-white/20"
            >
              <div className="absolute right-6 top-6 rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400">
                推荐
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-400/20 p-3 text-emerald-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white">快速测评</h3>
                <p className="mt-1 text-sm text-zinc-400">20 道精选题 · 约 3 分钟</p>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                覆盖四个核心维度的简易版测试，适合快速了解自己的人格大概倾向。
              </p>
            </button>

            <button
              onClick={() => startQuiz("full")}
              className="group relative flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10 hover:border-white/20"
            >
              <div className="rounded-2xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 p-3 text-violet-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white">深度测评</h3>
                <p className="mt-1 text-sm text-zinc-400">80 道完整题 · 约 12 分钟</p>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">
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
    <div className="flex h-full flex-col rounded-3xl border border-white/15 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      <div className="mb-6 flex items-center justify-between text-xs text-zinc-300">
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
            className="hidden rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-200 shadow-sm transition hover:bg-white/10 hover:text-white sm:inline-flex sm:items-center"
          >
            返回人格图鉴
          </button>
        </div>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
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
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300 ring-1 ring-white/10">
                  Q{currentIndex + 1}
                </div>
                <h2 className="text-base font-medium leading-relaxed text-zinc-50 sm:text-lg">
                  {currentQuestion.text}
                </h2>
                <p className="text-xs text-zinc-400">
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
                        ? "cursor-not-allowed border-white/10 bg-white/0 text-zinc-500"
                        : "border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    上一题
                  </button>
                  <div className="text-[11px] text-zinc-500">
                    已选择的选项会保留，可随时返回修改
                  </div>
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
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  测评完成
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                      {result.code}
                    </span>
                    <span className="text-xs text-zinc-400">
                      你当前更接近的 MBTI 人格倾向
                    </span>
                  </div>
                  {(() => {
                    const { summary, profile } = getProfileSummary(result.code);
                    return (
                      <>
                        {summary && (
                          <p className="text-xs leading-relaxed text-zinc-200">
                            {summary}
                          </p>
                        )}
                        {profile?.representatives && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-zinc-400">代表人物：</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.representatives.map(rep => (
                                    <span key={rep} className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-[10px] text-zinc-300 ring-1 ring-white/10">
                                        {rep}
                                    </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="mt-4 grid gap-3 text-xs text-zinc-300 sm:grid-cols-2">
                  {[
                    { key: "EI", left: "外向 (E)", right: "内向 (I)" },
                    { key: "SN", left: "实感 (S)", right: "直觉 (N)" },
                    { key: "TF", left: "思考 (T)", right: "情感 (F)" },
                    { key: "JP", left: "判断 (J)", right: "知觉 (P)" },
                  ].map((dim) => {
                     const pct = result.percentages[dim.key as keyof typeof result.percentages];
                     return (
                        <div key={dim.key} className="rounded-2xl bg-black/30 p-3 ring-1 ring-white/5">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                <span>{dim.left}</span>
                                <span>{dim.right}</span>
                            </div>
                            <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-zinc-200">
                                <span>{pct}%</span>
                                <span>{100 - pct}%</span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                                style={{ width: `${pct}%` }}
                            />
                            </div>
                        </div>
                     );
                  })}
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleViewDetail}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-400 px-5 py-3 text-sm font-medium text-zinc-50 shadow-lg shadow-emerald-500/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80"
                >
                  查看详细解析
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
