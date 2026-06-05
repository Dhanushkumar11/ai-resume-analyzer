import { Brain, FileText, RefreshCw, Search, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
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

  const filteredResumes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return resumes;
    return resumes.filter((resume) => resume.filename.toLowerCase().includes(term));
  }, [query, resumes]);

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
    <div className="space-y-7">
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Upload, inspect, and manage every AI-analyzed resume from a focused workspace built for serious career moves.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Workspace</p>
              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">Private resume library</p>
            </div>
            <button type="button" onClick={loadResumes} className="btn-secondary">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FileText} label="Total resumes" value={resumes.length} helper="Saved in your private history" />
        <StatCard icon={Brain} label="AI analyses" value={resumes.length} helper="Generated from uploaded PDFs" accent="blue" />
        <StatCard icon={ShieldCheck} label="Access" value="JWT" helper="Authenticated workspace" accent="emerald" />
      </section>

      <UploadPanel onUploaded={loadResumes} />

      {error ? <Alert>{error}</Alert> : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Resume history</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {resumes.length ? `${resumes.length} analyzed ${resumes.length === 1 ? "resume" : "resumes"} in your library.` : "Your analyzed resumes will appear here."}
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
