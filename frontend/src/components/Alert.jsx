import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";

export default function Alert({ children, tone = "error", title, action }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100"
      : tone === "info"
        ? "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
        : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-200";
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? TriangleAlert : tone === "info" ? Info : XCircle;

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm shadow-sm ${styles}`} role="status">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={`${title ? "mt-0.5" : ""} font-medium leading-6`}>{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
