import { UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { uploadResume } from "../api/resumes.js";
import { getErrorMessage } from "../utils/format.js";
import Alert from "./Alert.jsx";

export default function UploadPanel({ onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileLabel = useMemo(() => {
    if (!file) return "Choose PDF";
    const size = file.size / 1024 / 1024;
    return `${file.name} · ${size.toFixed(2)} MB`;
  }, [file]);

  function selectFile(selected) {
    setError("");
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

    try {
      const result = await uploadResume(file);
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
    <form onSubmit={handleSubmit} className="panel p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Analyze a resume</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload a PDF and get skill matches plus AI feedback.</p>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary">
          <UploadCloud className="h-4 w-4" />
          {submitting ? "Analyzing" : "Upload"}
        </button>
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
        className={`mt-5 flex min-h-36 w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 text-center transition ${
          dragging
            ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10"
            : "border-slate-300 bg-slate-50 hover:border-cyan-400 dark:border-white/10 dark:bg-slate-950 dark:hover:border-cyan-400"
        }`}
      >
        <UploadCloud className="mb-3 h-8 w-8 text-cyan-600 dark:text-cyan-300" />
        <span className="max-w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{fileLabel}</span>
        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Drag and drop or browse</span>
      </button>

      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => selectFile(event.target.files)} />

      {file ? (
        <button type="button" onClick={() => setFile(null)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <X className="h-4 w-4" />
          Clear file
        </button>
      ) : null}

      {error ? <div className="mt-4"><Alert>{error}</Alert></div> : null}
    </form>
  );
}
