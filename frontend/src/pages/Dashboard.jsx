import { Brain, FileCheck2, FileText, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteResume, getResumeHistory } from "../api/resumes.js";
import Alert from "../components/Alert.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ResumeCard from "../components/ResumeCard.jsx";
import StatCard from "../components/StatCard.jsx";
import UploadPanel from "../components/UploadPanel.jsx";
import { getErrorMessage } from "../utils/format.js";

export default function Dashboard() {
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
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">Resume command center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Upload, inspect, and manage every AI-analyzed resume from one professional workspace.
          </p>
        </div>
        <button type="button" onClick={loadResumes} className="btn-secondary">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FileText} label="Total resumes" value={resumes.length} helper="Saved in your private history" />
        <StatCard icon={Brain} label="AI analyses" value={resumes.length} helper="Generated from uploaded PDFs" />
        <StatCard icon={FileCheck2} label="Latest upload" value={resumes[0] ? "Ready" : "None"} helper={resumes[0]?.filename || "Upload a resume to begin"} />
      </section>

      <UploadPanel onUploaded={loadResumes} />

      {error ? <Alert>{error}</Alert> : null}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Resume history</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review details or remove resumes you no longer need.</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-10" value={query} placeholder="Search filenames" onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading resumes" />
        ) : filteredResumes.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={setDeleteId} deleting={deleting && deleteId === resume.id} />
            ))}
          </div>
        ) : resumes.length ? (
          <div className="panel flex min-h-44 items-center justify-center px-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            No resumes match your search.
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
