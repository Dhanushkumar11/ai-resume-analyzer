import { CheckCircle2, Info, XCircle } from "lucide-react";

export default function Alert({ children, tone = "error" }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200"
      : tone === "info"
        ? "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
        : "border-red-200 bg-red-50 text-red-800 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-200";
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Info : XCircle;

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium shadow-sm ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}
