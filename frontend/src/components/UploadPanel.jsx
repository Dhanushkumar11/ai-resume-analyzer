import { ArrowUpRight, CheckCircle2, FileText, Loader2, ScanLine, UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { uploadResume } from "../api/resumes.js";
import { getErrorMessage } from "../utils/format.js";
import Alert from "./Alert.jsx";

export default function UploadPanel({ onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const fileLabel = useMemo(() => {
    if (!file) return "Choose PDF";
    const size = file.size / 1024 / 1024;
    return `${file.name} - ${size.toFixed(2)} MB`;
  }, [file]);

  function selectFile(selected) {
    setError("");
    setSuccess("");
    setUploadResult(null);
    const nextFile = selected?.[0];

    if (!nextFile) return;

    if (nextFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setFile(nextFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Select a PDF resume before uploading.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    setUploadResult(null);

    try {
      const result = await uploadResume(file);
      setUploadResult(result);
      setSuccess(`${result.filename || file.name} is ready to review.`);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded?.(result);
    } catch (err) {
      setError(getErrorMessage(err, "Resume upload failed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">Primary action</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-950 dark:text-white">Analyze a resume</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload a PDF and get a structured readiness report using the current analysis engine.</p>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {submitting ? "Analyzing" : "Run review"}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          {[
            ["1", "Upload PDF", "Select the resume version you want reviewed."],
            ["2", "AI review", "Extract text, detect skills, and generate feedback."],
            ["3", "Act on fixes", "Open the report and work through the top gaps."],
          ].map(([step, title, description]) => (
            <div key={step} className="focus-card">
              <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">{step}</span>
              <p className="text-sm font-bold text-slate-950 dark:text-white">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectFile(event.dataTransfer.files);
          }}
          className={`flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 text-center transition duration-200 ${
            dragging
              ? "border-slate-900 bg-slate-100 dark:border-white dark:bg-white/10"
              : file
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-400/10"
                : "border-slate-300 bg-slate-50 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
          }`}
        >
          <span
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
              file
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                : "bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-200"
            }`}
          >
            {file ? <FileText className="h-6 w-6" /> : <ScanLine className="h-6 w-6" />}
          </span>
          <span className="max-w-full truncate text-sm font-extrabold text-slate-900 dark:text-white">{fileLabel}</span>
          <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {file ? "Ready for review" : "Drag and drop a PDF or browse your files"}
          </span>
        </button>

        {submitting ? (
          <div className="mt-4 space-y-2">
            <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-950 dark:bg-white" />
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Reviewing content, skills, role fit, and improvement opportunities.</p>
          </div>
        ) : null}

        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => selectFile(event.target.files)} />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {file ? (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear file
            </button>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">PDF only. The report is saved after review completes.</span>
          )}

          {success ? (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </span>
          ) : null}
        </div>

        {success ? (
          <div className="mt-4">
            <Alert
              tone="success"
              title="Analysis complete"
              action={
                uploadResult?.id ? (
                  <Link to={`/resumes/${uploadResult.id}`} className="inline-flex items-center gap-1 text-xs font-bold">
                    Open
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null
              }
            >
              {success}
            </Alert>
          </div>
        ) : null}

        {error ? (
          <div className="mt-4">
            <Alert>{error}</Alert>
          </div>
        ) : null}
      </div>
    </form>
  );
}
