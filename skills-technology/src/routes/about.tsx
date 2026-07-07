import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { StatsCounter } from "@/components/StatsCounter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Skills Technology Solutions" },
      { name: "description", content: "Our mission, our team, and how we teach." },
    ],
  }),
});

const TEAM = [
  { name: "Core Instructors", role: "3D Animation" },
  { name: "Core Instructors", role: "Content Automation" },
  { name: "Student Success", role: "Support & Mentorship" },
];

function AboutPage() {
  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl"
      >
        <h1 className="font-display text-4xl font-bold">Our mission</h1>
        <p className="mt-4 text-[var(--color-ink)]/70">
          Skills Technology Solutions exists to close the gap between
          learning a creative skill and actually shipping work with it. We
          teach 3D animation and content automation the way working
          creators actually use them — project-first, feedback-heavy, and
          always tied to a real, publishable outcome.
        </p>
      </motion.section>

      <StatsCounter />

      <section>
        <h2 className="mb-8 font-display text-3xl font-bold">Team</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.role} className="glass rounded-[var(--radius-card)] p-6 text-center">
              <div className="brand-gradient mx-auto h-16 w-16 rounded-full" />
              <h3 className="mt-4 font-display text-base font-semibold">{member.name}</h3>
              <p className="text-sm text-[var(--color-ink)]/60">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
