export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500 dark:border-slate-700 dark:border-t-cyan-400" />
      <span>{label}</span>
    </div>
  );
}
