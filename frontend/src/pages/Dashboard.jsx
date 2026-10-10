import { Clock3, FileText, RefreshCw, Search, ShieldCheck, Sparkles, Target, Trash2, TrendingUp, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteResume, getResumeHistory } from "../api/resumes.js";
import Alert from "../components/Alert.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ResumeCard from "../components/ResumeCard.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import StatCard from "../components/StatCard.jsx";
import UploadPanel from "../components/UploadPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/format.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const sortedResumes = useMemo(
    () => [...resumes].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()),
    [resumes],
  );
  const latestResume = sortedResumes[0];
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const filteredResumes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sortedResumes;
    return sortedResumes.filter((resume) => resume.filename.toLowerCase().includes(term));
  }, [query, sortedResumes]);

  async function loadResumes() {
    setLoading(true);
    setError("");

    try {
      setResumes(await getResumeHistory());
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load resume history."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await deleteResume(deleteId);
      setResumes((current) => current.filter((resume) => resume.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete resume."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-soft dark:border-white/10">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_360px] lg:p-7">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Career readiness workspace
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">
                Welcome back, {firstName}. Make the next resume version sharper.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Review saved reports, upload new versions, and keep every improvement tied to a focused resume analysis.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => document.getElementById("resume-upload")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <UploadCloud className="h-4 w-4" />
                Analyze resume
              </button>
              <button type="button" onClick={loadResumes} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Next best action</p>
            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{latestResume ? "Open your latest report" : "Create your first report"}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {latestResume
                    ? "Start with the newest analysis, then upload a revised PDF after applying the recommendations."
                    : "Upload a PDF to generate a score, skill matches, gaps, role suggestions, and improvement steps."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FileText} label="Reports saved" value={resumes.length} helper="Every uploaded PDF creates a saved analysis record." />
        <StatCard icon={Clock3} label="Latest review" value={latestResume ? "Ready" : "None yet"} helper={latestResume ? latestResume.filename : "Upload a resume to start your library."} accent={latestResume ? "emerald" : "amber"} />
        <StatCard icon={ShieldCheck} label="Workspace" value="Private" helper="Reports are available only inside your signed-in account." accent="blue" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div id="resume-upload">
          <UploadPanel onUploaded={loadResumes} />
        </div>
        <aside className="panel p-5">
          <p className="eyebrow">Review system</p>
          <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">What each report covers</h2>
          <div className="mt-5 space-y-3">
            {[
              [TrendingUp, "Readiness score", "A 0-100 signal for overall resume strength."],
              [ShieldCheck, "Skill evidence", "Matched strengths and missing capabilities."],
              [Target, "Role direction", "Suggested roles based on the resume content."],
            ].map(([Icon, title, copy]) => (
              <div key={title} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.025]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-200">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {error ? <Alert>{error}</Alert> : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-heading">Resume library</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {resumes.length ? `${resumes.length} saved ${resumes.length === 1 ? "report" : "reports"} ready for review.` : "Your saved reports will appear here."}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-10" value={query} placeholder="Search filenames" onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : filteredResumes.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={setDeleteId} deleting={deleting && deleteId === resume.id} />
            ))}
          </div>
        ) : resumes.length ? (
          <div className="panel flex min-h-52 flex-col items-center justify-center px-6 text-center">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
              <Search className="h-5 w-5" />
            </span>
            <h3 className="text-base font-extrabold text-slate-950 dark:text-white">No matching resumes</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different filename search.</p>
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete resume"
        message="This removes the resume file and its AI analysis from your history."
        confirmLabel={
          <span className="inline-flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </span>
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
