import { motion } from "framer-motion";
import type { Question } from "../data/quiz-data";

type AppTheme = "aurora" | "sunset" | "mono" | "light";

interface QuestionIllustrationProps {
  question: Question;
  theme: AppTheme;
  className?: string;
}

interface IllustrationWrapperProps {
  children: React.ReactNode;
  className?: string;
  isLight: boolean;
  fillSoft: string;
}

function IllustrationWrapper({
  children,
  className,
  isLight,
  fillSoft,
}: IllustrationWrapperProps) {
  return (
    <div
      className={`relative mx-auto h-40 w-full max-w-[340px] overflow-hidden rounded-2xl ${
        isLight ? "bg-white ring-1 ring-zinc-200" : "bg-white/5 ring-1 ring-white/10"
      } ${className ?? ""}`}
    >
      <svg viewBox="0 0 360 160" className="h-full w-full">
        <motion.circle
          cx="280"
          cy="70"
          r="70"
          fill={fillSoft}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
        />
        {children}
      </svg>
    </div>
  );
}

export default function QuestionIllustration({
  question,
  theme,
  className,
}: QuestionIllustrationProps) {
  const isLight = theme === "light";

  const stroke =
    theme === "aurora"
      ? "#8EE6DA"
      : theme === "sunset"
        ? "#F3B3D9"
        : isLight
          ? "#1F2937"
          : "#D1D5DB";
  const fillSoft =
    theme === "aurora"
      ? "rgba(56, 189, 248, 0.12)"
      : theme === "sunset"
        ? "rgba(244, 114, 182, 0.12)"
        : isLight
          ? "rgba(243, 244, 246, 1)"
          : "rgba(255,255,255,0.06)";

  const commonProps = { stroke, strokeWidth: 1.6, fill: "none" as const };

  if (question.dimension === "EI") {
    // Crowd vs Solo
    return (
      <IllustrationWrapper isLight={isLight} fillSoft={fillSoft} className={className}>
        <motion.g initial={{ x: -10 }} animate={{ x: 0 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}>
          <circle cx="80" cy="70" r="22" {...commonProps} />
          <circle cx="55" cy="95" r="18" {...commonProps} />
          <circle cx="105" cy="95" r="18" {...commonProps} />
        </motion.g>
        <motion.g initial={{ y: 0 }} animate={{ y: -4 }} transition={{ duration: 1.4, repeat: Infinity, repeatType: "mirror" }}>
          <rect x="230" y="60" width="36" height="36" rx="8" {...commonProps} />
          <line x1="248" y1="60" x2="248" y2="42" {...commonProps} />
        </motion.g>
      </IllustrationWrapper>
    );
  }

  if (question.dimension === "SN") {
    // Magnifier vs Stars
    return (
      <IllustrationWrapper isLight={isLight} fillSoft={fillSoft} className={className}>
        <motion.g initial={{ rotate: -10 }} animate={{ rotate: 10 }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}>
          <circle cx="90" cy="70" r="24" {...commonProps} />
          <rect x="108" y="88" width="30" height="6" rx="3" {...commonProps} />
        </motion.g>
        <motion.g initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}>
          <polygon points="240,60 246,72 260,74 250,84 252,98 240,92 228,98 230,84 220,74 234,72" stroke={stroke} fill={fillSoft} />
          <polygon points="290,40 294,48 304,49 297,56 298,65 290,61 282,65 283,56 276,49 286,48" stroke={stroke} fill={fillSoft} />
        </motion.g>
      </IllustrationWrapper>
    );
  }

  if (question.dimension === "TF") {
    // Scale vs Heart
    return (
      <IllustrationWrapper isLight={isLight} fillSoft={fillSoft} className={className}>
        <motion.g initial={{ y: 0 }} animate={{ y: -6 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}>
          <line x1="80" y1="50" x2="80" y2="100" {...commonProps} />
          <line x1="50" y1="50" x2="110" y2="50" {...commonProps} />
          <circle cx="55" cy="80" r="12" {...commonProps} />
          <rect x="98" y="68" width="18" height="18" rx="3" {...commonProps} />
        </motion.g>
        <motion.path
          d="M260 70 C260 60 275 58 280 66 C285 58 300 60 300 70 C300 84 280 92 280 92 C280 92 260 84 260 70 Z"
          stroke={stroke}
          fill={fillSoft}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
        />
      </IllustrationWrapper>
    );
  }

  // JP: Calendar vs Paper plane
  return (
    <IllustrationWrapper isLight={isLight} fillSoft={fillSoft} className={className}>
      <motion.g initial={{ y: 0 }} animate={{ y: -5 }} transition={{ duration: 1.6, repeat: Infinity, repeatType: "mirror" }}>
        <rect x="60" y="56" width="64" height="46" rx="8" {...commonProps} />
        <line x1="60" y1="72" x2="124" y2="72" {...commonProps} />
        <line x1="74" y1="82" x2="110" y2="82" {...commonProps} />
        <line x1="74" y1="92" x2="102" y2="92" {...commonProps} />
      </motion.g>
      <motion.g initial={{ rotate: -8 }} animate={{ rotate: 8 }} transition={{ duration: 1.4, repeat: Infinity, repeatType: "mirror" }}>
        <polygon points="240,60 300,80 270,88 260,110 240,60" stroke={stroke} fill={fillSoft} />
      </motion.g>
    </IllustrationWrapper>
  );
}
