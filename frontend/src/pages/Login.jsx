import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/format.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to review your resume intelligence.">
      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <ShieldCheck className="h-4 w-4" />
          Secure workspace access
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Your session is stored locally with the backend JWT token.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}

        <label className="block space-y-2">
          <span className="label">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              type="email"
              value={form.email}
              placeholder="you@example.com"
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
              placeholder="Your password"
              autoComplete="current-password"
              required
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </span>
        </label>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Signing in" : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        New here?{" "}
        <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
