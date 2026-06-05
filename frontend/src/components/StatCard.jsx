export default function StatCard({ icon: Icon, label, value, helper, accent = "slate" }) {
  const accentClass =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
      : accent === "blue"
        ? "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200"
        : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <div className="panel surface-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {helper ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}
