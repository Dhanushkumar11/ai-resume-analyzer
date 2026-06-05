export default function Alert({ children, tone = "error" }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200";

  return <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${styles}`}>{children}</div>;
}
