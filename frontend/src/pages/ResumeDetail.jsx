import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Calendar,
  ChevronDown,
  FileText,
  Gauge,
  Lightbulb,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteResume, getResumeDetail } from "../api/resumes.js";
import Alert from "../components/Alert.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { formatDate, getErrorMessage } from "../utils/format.js";

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getScoreStatus(score) {
  if (score >= 90) return { label: "Excellent", helper: "90+ Excellent", color: "bg-emerald-500" };
  if (score >= 75) return { label: "Good", helper: "75+ Good", color: "bg-cyan-500" };
  if (score >= 60) return { label: "Average", helper: "60+ Average", color: "bg-amber-500" };
  return { label: "Needs Improvement", helper: "Below 60 Needs Improvement", color: "bg-rose-500" };
}

function ResumeDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <div className="skeleton h-4 w-32" />
        <div className="mt-4 skeleton h-9 w-2/3" />
        <div className="mt-3 skeleton h-4 w-52" />
      </div>
      <div className="panel p-8 text-center">
        <div className="mx-auto skeleton h-5 w-28" />
        <div className="mx-auto mt-5 skeleton h-16 w-44" />
        <div className="mx-auto mt-6 skeleton h-3 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="skeleton h-5 w-40" />
          <div className="mt-5 flex gap-2">
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-8 w-24 rounded-full" />
          </div>
        </div>
        <div className="panel p-5">
          <div className="skeleton h-5 w-36" />
          <div className="mt-5 flex gap-2">
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-8 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AtsScoreHero({ score }) {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));
  const status = getScoreStatus(safeScore);
  const labels = ["90+ Excellent", "75+ Good", "60+ Average", "Below 60 Needs Improvement"];

  return (
    <section className="panel surface-hover overflow-hidden">
      <div className="mx-auto max-w-4xl px-5 py-8 text-center sm:px-8 sm:py-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
          <Gauge className="h-6 w-6" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">ATS Score</p>
        <div className="mt-3 flex items-end justify-center gap-2">
          <span className="text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-7xl">{safeScore}</span>
          <span className="pb-2 text-2xl font-extrabold text-slate-400 dark:text-slate-500">/ 100</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{status.label}</p>

        <div className="mx-auto mt-7 max-w-2xl">
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className={`h-full rounded-full ${status.color} transition-all duration-700`} style={{ width: `${safeScore}%` }} />
          </div>
          <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:grid-cols-4">
            {labels.map((label) => (
              <span
                key={label}
                className={`rounded-full border px-3 py-1.5 ${
                  label === status.helper
                    ? "border-slate-300 bg-white text-slate-900 shadow-sm dark:border-white/20 dark:bg-white/10 dark:text-white"
                    : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children, tone = "neutral" }) {
  const styles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
    warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200",
    role: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-200",
    neutral: "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200",
  };

  return <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${styles[tone]}`}>{children}</span>;
}

function BadgeCard({ icon: Icon, title, subtitle, items, tone }) {
  return (
    <article className="panel surface-hover p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Pill key={item} tone={tone}>
              {item}
            </Pill>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          No items returned for this section.
        </p>
      )}
    </article>
  );
}

function Accordion({ icon: Icon, title, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-white/[0.04]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-extrabold text-slate-950 dark:text-white">{title}</span>
            <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{items.length} insights</span>
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 p-5 dark:border-white/10">
            {items.length ? (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No insights returned for this section.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ResumeContentAccordion({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel overflow-hidden opacity-95">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 dark:hover:bg-white/[0.04]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-slate-950 dark:text-white">Resume Content</span>
            <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{open ? "Hide parsed resume text" : "View Resume Content"}</span>
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-600 dark:text-slate-300">
              {text || "No extracted text is available."}
            </pre>
          </div>
        </div>
      </div>
    </section>
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

  const analysis = resume?.ai_analysis || {};
  const strengths = useMemo(() => toArray(analysis.strengths), [analysis.strengths]);
  const missingSkills = useMemo(() => toArray(analysis.missing_skills), [analysis.missing_skills]);
  const weaknesses = useMemo(() => toArray(analysis.weaknesses), [analysis.weaknesses]);
  const improvements = useMemo(() => toArray(analysis.improvements), [analysis.improvements]);
  const roles = useMemo(() => toArray(analysis.roles), [analysis.roles]);

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
    return <ResumeDetailSkeleton />;
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
    <div className="space-y-7">
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Resume analysis
            </p>
            <h1 className="mt-4 max-w-4xl break-words text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">{resume.filename}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              Uploaded {formatDate(resume.created_at)}
            </p>
          </div>
          <button type="button" onClick={() => setConfirmOpen(true)} className="btn-danger">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </section>

      {error ? <Alert>{error}</Alert> : null}

      <AtsScoreHero score={analysis.ats_score} />

      <section className="grid gap-4 lg:grid-cols-2">
        <BadgeCard icon={BadgeCheck} title="Technical Strengths" subtitle="Skills and technologies detected as positive signals." items={strengths} tone="positive" />
        <BadgeCard icon={Wrench} title="Missing Skills" subtitle="Capabilities that could make the resume more competitive." items={missingSkills} tone="warning" />
        <div className="lg:col-span-2">
          <BadgeCard icon={BriefcaseBusiness} title="Recommended Roles" subtitle="Suggested job titles based on the analysis." items={roles} tone="role" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Detailed Insights</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Expand each section to review weaknesses and suggested improvements.</p>
        </div>
        <Accordion icon={AlertTriangle} title="Weaknesses" items={weaknesses} />
        <Accordion icon={Lightbulb} title="Suggested Improvements" items={improvements} />
      </section>

      <ResumeContentAccordion text={resume.extracted_text} />

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
