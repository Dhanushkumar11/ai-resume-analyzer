import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/format.js";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Start analyzing resumes with a secure workspace.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}

        <label className="block space-y-2">
          <span className="label">Full name</span>
          <span className="relative block">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              value={form.name}
              minLength={3}
              autoComplete="name"
              required
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </span>
        </label>

        <label className="block space-y-2">
          <span className="label">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              type="email"
              value={form.email}
              autoComplete="email"
              required
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </span>
        </label>

        <label className="block space-y-2">
          <span className="label">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              type="password"
              value={form.password}
              minLength={8}
              autoComplete="new-password"
              required
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </span>
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account" : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
