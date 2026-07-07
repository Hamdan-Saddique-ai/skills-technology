import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth";
import { FloatingLogo } from "@/components/FloatingLogo";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "Sign in — Skills Technology Solutions" }],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result =
      mode === "signin"
        ? await signInWithPassword(form.email, form.password)
        : await signUpWithPassword(form.email, form.password, form.name);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-[var(--radius-card)] md:grid-cols-2">
      <div className="brand-gradient relative hidden items-center justify-center p-10 md:flex">
        <FloatingLogo />
      </div>

      <div className="glass flex items-center justify-center p-8 md:rounded-none">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex gap-2 rounded-[var(--radius-pill)] bg-[var(--color-ink)]/5 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-[var(--radius-pill)] py-2 text-sm font-semibold transition ${
                mode === "signin" ? "brand-gradient text-white" : "text-[var(--color-ink)]/60"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-[var(--radius-pill)] py-2 text-sm font-semibold transition ${
                mode === "signup" ? "brand-gradient text-white" : "text-[var(--color-ink)]/60"
              }`}
            >
              Sign up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "signin" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signin" ? 16 : -16 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
                    Full name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-royal)]"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-royal)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
                  Password
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-royal)]"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="brand-gradient glow-ring w-full rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
