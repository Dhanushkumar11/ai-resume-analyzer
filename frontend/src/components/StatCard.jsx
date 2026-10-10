export default function StatCard({ icon: Icon, label, value, helper, accent = "slate", meta }) {
  const accentClass =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
      : accent === "amber"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-100"
      : accent === "rose"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200"
      : accent === "blue"
        ? "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200"
        : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <div className="panel surface-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {helper ? <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{helper}</p> : null}
      {meta ? <p className="mt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">{meta}</p> : null}
    </div>
  );
}
