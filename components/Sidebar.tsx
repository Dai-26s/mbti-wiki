type SidebarView = "gallery" | "quiz";
type AppTheme = "aurora" | "sunset" | "mono";

interface SidebarProps {
  activeView: SidebarView;
  onChangeView: (view: SidebarView) => void;
  theme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
}

export default function Sidebar({
  activeView,
  onChangeView,
  theme,
  onChangeTheme,
}: SidebarProps) {
  const menus = [
    { key: "quiz", label: "人格测评" },
    { key: "report", label: "我的报告", disabled: true },
    { key: "gallery", label: "人格图鉴" },
  ];

  const logoBg =
    theme === "aurora"
      ? "bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"
      : theme === "sunset"
        ? "bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300"
        : "bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700";

  const accentDot =
    theme === "aurora"
      ? "bg-gradient-to-tr from-sky-400 to-emerald-400"
      : theme === "sunset"
        ? "bg-gradient-to-tr from-rose-400 to-amber-300"
        : "bg-zinc-200";

  return (
    <aside className="flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-white/10 bg-clip-padding p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/70">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold text-white shadow-lg ${logoBg}`}
          >
            MB
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-zinc-200">MBTI Wiki</div>
            <div className="text-xs text-zinc-400">探索你的性格与潜力</div>
          </div>
        </div>
        <nav className="space-y-2">
          {menus.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                if (item.key === "quiz" || item.key === "gallery") {
                  onChangeView(item.key);
                }
              }}
              type="button"
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
                item.key === activeView
                  ? "bg-white/15 text-white"
                  : "text-zinc-200 hover:bg-white/10 hover:text-white"
              } ${item.disabled ? "cursor-not-allowed opacity-60 hover:bg-transparent" : ""}`}
            >
              <span>{item.label}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${accentDot}`}
              />
            </button>
          ))}
        </nav>
        <div className="pt-4">
          <div className="mb-2 text-xs font-medium text-zinc-400">界面配色</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme("aurora")}
              className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] transition ${
                theme === "aurora"
                  ? "border-white/40 bg-white/10 text-zinc-50"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-400" />
              <span>极光</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme("sunset")}
              className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] transition ${
                theme === "sunset"
                  ? "border-white/40 bg-white/10 text-zinc-50"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-300" />
              <span>暮光</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme("mono")}
              className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] transition ${
                theme === "mono"
                  ? "border-white/40 bg-white/10 text-zinc-50"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-500" />
              <span>纯净</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-zinc-400">
        <div className="font-medium text-zinc-300">小提示</div>
        <p className="mt-1 leading-relaxed">
          人格并非标签，而是理解自我与他人的窗口。
        </p>
      </div>
    </aside>
  );
}
