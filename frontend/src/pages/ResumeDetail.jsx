import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Gauge,
  Lightbulb,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteResume, getResumeDetail } from "../api/resumes.js";
import Alert from "../components/Alert.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { formatDate, getErrorMessage, splitSkills } from "../utils/format.js";

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function clampScore(score) {
  return Math.max(0, Math.min(Number(score) || 0, 100));
}

function getScoreStatus(score) {
  if (score >= 90) return { label: "Excellent", tone: "emerald", bar: "bg-emerald-500", copy: "Strong enough to refine for specific roles." };
  if (score >= 75) return { label: "Strong", tone: "cyan", bar: "bg-cyan-500", copy: "A credible resume with targeted improvements left." };
  if (score >= 60) return { label: "Developing", tone: "amber", bar: "bg-amber-500", copy: "A workable base that needs clearer evidence and coverage." };
  return { label: "Needs focus", tone: "rose", bar: "bg-rose-500", copy: "Prioritize structure, evidence, and missing signals before applying." };
}

function uniqueItems(items) {
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
}

function ResumeDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <div className="skeleton h-4 w-32" />
        <div className="mt-4 skeleton h-9 w-2/3" />
        <div className="mt-3 skeleton h-4 w-52" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="panel p-6">
          <div className="skeleton h-24 w-full" />
          <div className="mt-5 skeleton h-3 w-full" />
        </div>
        <div className="panel p-6">
          <div className="skeleton h-5 w-40" />
          <div className="mt-5 space-y-3">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><div className="skeleton h-20 w-full" /></div>
        <div className="panel p-5"><div className="skeleton h-20 w-full" /></div>
        <div className="panel p-5"><div className="skeleton h-20 w-full" /></div>
      </div>
    </div>
  );
}

function ScorePanel({ score }) {
  const safeScore = clampScore(score);
  const status = getScoreStatus(safeScore);

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Readiness score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white">{safeScore}</span>
            <span className="pb-2 text-xl font-extrabold text-slate-400">/100</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{status.label}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
          <Gauge className="h-6 w-6" />
        </span>
      </div>
      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className={`h-full rounded-full ${status.bar} transition-all duration-700`} style={{ width: `${safeScore}%` }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{status.copy}</p>
        <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">This score is a guidance signal for revision, not a recruiter-visible grade.</p>
      </div>
    </section>
  );
}

function MetricTile({ icon: Icon, label, value, helper, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-100",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200",
  };

  return (
    <article className="panel surface-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{helper}</p>
    </article>
  );
}

function PriorityList({ items }) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Action plan</p>
          <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">Top fixes to make next</h2>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
          <ListChecks className="h-5 w-5" />
        </span>
      </div>
      {items.length ? (
        <ol className="mt-5 space-y-3">
          {items.map((item, index) => (
            <li key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.025]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
              <span className="pt-0.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.025] dark:text-slate-400">
          No prioritized fixes were returned. Review the parsed resume to confirm the content was extracted correctly.
        </p>
      )}
    </section>
  );
}

function TagCloud({ title, subtitle, items, icon: Icon, tone = "neutral" }) {
  const styles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100",
    role: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-200",
    neutral: "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200",
  };

  return (
    <article className="panel p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${styles[tone]}`}>
              {item}
            </span>
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

function InsightSection({ icon: Icon, title, items, empty, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 dark:hover:bg-white/[0.04]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-slate-950 dark:text-white">{title}</span>
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
                    <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{empty}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ParsedResume({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 dark:hover:bg-white/[0.04]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-slate-950 dark:text-white">Parsed resume text</span>
            <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{open ? "Hide extracted content" : "Inspect the text used for this analysis"}</span>
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

  const rawAnalysis = resume?.ai_analysis;
  const analysis = rawAnalysis && typeof rawAnalysis === "object" && !Array.isArray(rawAnalysis) ? rawAnalysis : {};
  const analysisMessage = typeof rawAnalysis === "string" ? rawAnalysis : "";

  const strengths = useMemo(() => toArray(analysis.strengths), [analysis.strengths]);
  const missingSkills = useMemo(() => toArray(analysis.missing_skills), [analysis.missing_skills]);
  const weaknesses = useMemo(() => toArray(analysis.weaknesses), [analysis.weaknesses]);
  const improvements = useMemo(() => toArray(analysis.improvements), [analysis.improvements]);
  const roles = useMemo(() => toArray(analysis.roles), [analysis.roles]);
  const matchedSkills = useMemo(() => splitSkills(resume?.matched_skills), [resume?.matched_skills]);
  const score = clampScore(analysis.ats_score);

  const priorityItems = useMemo(
    () =>
      uniqueItems([
        ...improvements.slice(0, 4),
        ...missingSkills.slice(0, 3).map((skill) => `Add credible evidence for ${skill} if it matches your experience.`),
        ...weaknesses.slice(0, 2),
      ]).slice(0, 5),
    [improvements, missingSkills, weaknesses],
  );

  const recruiterRead = useMemo(() => {
    if (!resume) return "";
    if (score >= 75) {
      return "A recruiter would likely understand the candidate direction quickly. The next improvement is making achievements more specific and role-aligned.";
    }
    if (score >= 60) {
      return "A recruiter can see useful signals, but the resume may need stronger proof, cleaner prioritization, and more relevant keywords.";
    }
    return "A recruiter may need to work too hard to understand fit. Start by tightening structure, adding measurable outcomes, and covering the highest-priority skill gaps.";
  }, [resume, score]);

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
    <div className="space-y-6">
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to workspace
            </Link>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Resume report
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
      {analysisMessage ? <Alert tone="warning" title="Analysis needs review">{analysisMessage}</Alert> : null}

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <ScorePanel score={score} />
        <PriorityList items={priorityItems} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricTile icon={BadgeCheck} label="Strengths" value={strengths.length || matchedSkills.length} helper="Signals already detected in the resume." tone="emerald" />
        <MetricTile icon={Wrench} label="Skill gaps" value={missingSkills.length} helper="Capabilities the report suggests improving or adding." tone={missingSkills.length ? "amber" : "emerald"} />
        <MetricTile icon={BriefcaseBusiness} label="Role paths" value={roles.length} helper="Suggested directions based on the analysis." tone="blue" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div>
            <h2 className="section-heading">Report breakdown</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review strengths, gaps, and recommendations in the order most users should act on them.</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <TagCloud icon={BadgeCheck} title="Detected strengths" subtitle="Skills and signals already working in your favor." items={strengths.length ? strengths : matchedSkills} tone="positive" />
            <TagCloud icon={Wrench} title="Missing skills" subtitle="Potential gaps to address when they match your real experience." items={missingSkills} tone="warning" />
            <div className="xl:col-span-2">
              <TagCloud icon={BriefcaseBusiness} title="Recommended roles" subtitle="Role directions inferred from the resume content." items={roles} tone="role" />
            </div>
          </div>

          <InsightSection icon={AlertTriangle} title="Weaknesses" items={weaknesses} empty="No weaknesses were returned for this section." defaultOpen />
          <InsightSection icon={Lightbulb} title="Suggested improvements" items={improvements} empty="No improvements were returned for this section." defaultOpen />
          <ParsedResume text={resume.extracted_text} />
        </div>

        <aside className="space-y-4">
          <section className="panel p-5">
            <p className="eyebrow">Recruiter perspective</p>
            <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">How this reads at a glance</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{recruiterRead}</p>
          </section>

          <section className="panel p-5">
            <p className="eyebrow">How to use this</p>
            <h2 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">Turn the report into a revision</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <p className="flex gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                Start with the highest priority fix before polishing wording.
              </p>
              <p className="flex gap-2">
                <ClipboardCheck className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                Add only skills you can credibly defend in an interview.
              </p>
              <p className="flex gap-2">
                <Target className="mt-1 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-200" />
                Upload the revised PDF as a new version when you are ready.
              </p>
            </div>
          </section>
        </aside>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Delete resume report"
        message={`This permanently removes "${resume.filename}" and its saved analysis from your workspace.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
