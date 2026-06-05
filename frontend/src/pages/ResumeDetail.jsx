import { ArrowLeft, Brain, Calendar, CheckCircle2, FileText, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteResume, getResumeDetail } from "../api/resumes.js";
import Alert from "../components/Alert.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatDate, getErrorMessage, splitSkills } from "../utils/format.js";

const analysisSections = [
  "ATS Score",
  "Technical Strengths",
  "Missing Skills",
  "Resume Weaknesses",
  "Suggested Improvements",
  "Suitable Job Roles",
];

function normalizeAnalysisMarkdown(markdown = "") {
  return markdown
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      const normalizedLine = trimmedLine
        .replace(/^#{1,6}\s+/, "")
        .replace(/^\*\*(.+?)\*\*:?\s*$/, "$1")
        .replace(/:$/, "")
        .trim();
      const sectionTitle = analysisSections.find((section) => section.toLowerCase() === normalizedLine.toLowerCase());

      return sectionTitle ? `### ${sectionTitle}` : line;
    })
    .join("\n");
}

function AiAnalysisMarkdown({ content }) {
  const markdown = normalizeAnalysisMarkdown(content || "No AI analysis is available for this resume.");

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/80 sm:p-5">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h3 className="mb-4 border-b border-slate-200 pb-3 text-xl font-extrabold text-slate-950 dark:border-white/10 dark:text-white">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-4 border-b border-slate-200 pb-3 text-lg font-extrabold text-slate-950 dark:border-white/10 dark:text-white">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 text-base font-extrabold text-slate-950 first:mt-0 first:border-t-0 first:pt-0 dark:border-white/10 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(8,145,178,0.12)] dark:bg-cyan-300 dark:shadow-[0_0_0_4px_rgba(103,232,249,0.14)]" />
              {children}
            </h3>
          ),
          h4: ({ children }) => <h4 className="mb-2 mt-5 text-sm font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">{children}</h4>,
          p: ({ children }) => <p className="mb-4 text-sm leading-7 text-slate-700 last:mb-0 dark:text-slate-200">{children}</p>,
          ul: ({ children }) => <ul className="mb-5 space-y-2 pl-1 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700 last:mb-0 dark:text-slate-200">{children}</ol>,
          li: ({ children }) => (
            <li className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-300" />
              <span className="min-w-0">{children}</span>
            </li>
          ),
          strong: ({ children }) => <strong className="font-extrabold text-slate-950 dark:text-white">{children}</strong>,
          em: ({ children }) => <em className="font-medium text-slate-600 dark:text-slate-300">{children}</em>,
          code: ({ children }) => (
            <code className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-5 rounded-lg border-l-4 border-cyan-500 bg-white p-4 text-sm leading-7 text-slate-700 last:mb-0 dark:bg-slate-900 dark:text-slate-200">
              {children}
            </blockquote>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const skills = useMemo(() => splitSkills(resume?.matched_skills), [resume]);

  useEffect(() => {
    let alive = true;

    async function loadDetail() {
      setLoading(true);
      setError("");

      try {
        const data = await getResumeDetail(id);
        if (alive) setResume(data);
      } catch (err) {
        if (alive) setError(getErrorMessage(err, "Unable to load resume detail."));
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadDetail();

    return () => {
      alive = false;
    };
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await deleteResume(id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete resume."));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading resume detail" />;
  }

  if (error && !resume) {
    return (
      <div className="space-y-4">
        <Link to="/dashboard" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Alert>{error}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <h1 className="max-w-4xl break-words text-3xl font-extrabold text-slate-950 dark:text-white">{resume.filename}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            Uploaded {formatDate(resume.created_at)}
          </p>
        </div>
        <button type="button" onClick={() => setConfirmOpen(true)} className="btn-danger">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </section>

      {error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <article className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">Matched skills</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{skills.length} skills detected</p>
              </div>
            </div>

            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No predefined skills were matched in this resume.</p>
            )}
          </article>

          <article className="panel overflow-hidden">
            <div className="border-b border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">AI analysis</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Structured feedback rendered from your backend markdown</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-white to-slate-50 p-4 dark:from-slate-900 dark:to-slate-950 sm:p-5">
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Review</p>
                  <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">AI formatted</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Sections</p>
                  <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">Auto detected</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Readability</p>
                  <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">Dashboard style</p>
                </div>
              </div>
              <AiAnalysisMarkdown content={resume.ai_analysis} />
            </div>
          </article>
        </div>

        <article className="panel overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Extracted resume text</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Original PDF content parsed by the backend</p>
            </div>
          </div>
          <div className="max-h-[720px] overflow-auto p-5">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700 dark:text-slate-200">
              {resume.extracted_text || "No extracted text is available."}
            </pre>
          </div>
        </article>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Delete resume"
        message="This permanently removes the resume file and its saved AI analysis."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
