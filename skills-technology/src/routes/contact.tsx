import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Skills Technology Solutions" },
      { name: "description", content: "Get in touch with the Skills Technology team." },
    ],
  }),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-4xl font-bold">Get in touch</h1>
        <p className="mt-3 max-w-sm text-[var(--color-ink)]/65">
          Questions about a course, enrollment, or a partnership? Send us a
          message and we'll get back to you.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-sm text-[var(--color-ink)]/70">
            <Mail size={18} className="text-[var(--color-royal)]" /> hello@sktechnology.org
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-ink)]/70">
            <MapPin size={18} className="text-[var(--color-royal)]" /> Multan, Punjab, Pakistan
          </div>
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="glass space-y-4 rounded-[var(--radius-card)] p-6"
      >
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <CheckCircle2 size={40} className="text-[var(--color-royal)]" />
              <p className="font-display text-lg font-semibold">Message sent</p>
              <p className="text-sm text-[var(--color-ink)]/60">We'll reply within 1–2 business days.</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-2 text-sm font-semibold text-[var(--color-royal)]"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
                  Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-royal)]"
                />
              </div>
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
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-royal)]"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong sending your message — please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="brand-gradient glow-ring w-full rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
