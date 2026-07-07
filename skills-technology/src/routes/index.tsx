import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Video, Bot, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/CourseCard";
import { StatsCounter } from "@/components/StatsCounter";
import { TestimonialsMarquee } from "@/components/TestimonialsMarquee";
import { MagneticButton } from "@/components/MagneticButton";
import { FloatingLogo } from "@/components/FloatingLogo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Skills Technology Solutions — Learn. Build. Launch." },
      {
        name: "description",
        content:
          "3D animation and TikTok automation courses that take you from zero to shipped.",
      },
    ],
  }),
});

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FEATURES = [
  {
    icon: Video,
    title: "Learn by shipping",
    body: "Every course ends with a real, publishable project — not just a certificate.",
  },
  {
    icon: Bot,
    title: "Automation-first",
    body: "We teach the tools and pipelines that let you scale content without burning out.",
  },
  {
    icon: Award,
    title: "Instructor feedback",
    body: "VIP tracks include direct review from working creators and animators.",
  },
  {
    icon: Sparkles,
    title: "Always current",
    body: "Curriculum is refreshed as platforms and tools change — no stale lessons.",
  },
];

function HomePage() {
  const [popular, setPopular] = useState<Course[]>([]);
  const [vip, setVip] = useState<Course[]>([]);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("courses")
      .select("*")
      .order("rating", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (mounted && data) {
          setPopular(data.filter((c) => !c.is_vip));
          setVip(data.filter((c) => c.is_vip));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-28">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-1 items-center gap-10 pt-6 md:grid-cols-2">
        <motion.div initial="hidden" animate="show" variants={reveal} className="space-y-6">
          <span className="glass inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-1.5 text-xs font-semibold text-[var(--color-royal)]">
            <Sparkles size={14} /> New cohorts opening monthly
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Learn skills that
            <span className="brand-gradient-text"> ship</span>.
          </h1>
          <p className="max-w-md text-base text-[var(--color-ink)]/70">
            Practical courses in 3D animation and content automation, built by
            creators, for creators — go from first render to first client.
          </p>
          <div className="flex flex-wrap gap-4">
            <MagneticButton
              as="a"
              href="/auth"
              className="brand-gradient glow-ring rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold text-white"
            >
              Join now
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/auth"
              className="glass rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Login
            </MagneticButton>
          </div>
        </motion.div>

        <FloatingLogo />
      </section>

      <StatsCounter />

      {/* ---------------------------------------------------------------- */}
      {/* Popular courses                                                   */}
      {/* ---------------------------------------------------------------- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={reveal}
      >
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Popular courses</h2>
          <Link to="/courses" className="text-sm font-semibold text-[var(--color-royal)]">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* VIP band                                                          */}
      {/* ---------------------------------------------------------------- */}
      {vip.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          className="brand-gradient relative overflow-hidden rounded-[calc(var(--radius-card)*2)] px-8 py-14 text-white"
        >
          <h2 className="font-display text-3xl font-bold">VIP courses</h2>
          <p className="mt-2 max-w-lg text-white/80">
            Small cohorts, direct instructor feedback, and priority support.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vip.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Why choose us                                                     */}
      {/* ---------------------------------------------------------------- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={reveal}
      >
        <h2 className="mb-8 font-display text-3xl font-bold">Why choose Skills Technology</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-[var(--radius-card)] p-6">
              <f.icon className="text-[var(--color-royal)]" size={28} />
              <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink)]/65">{f.body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ---------------------------------------------------------------- */}
      {/* Testimonials                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 className="mb-6 font-display text-3xl font-bold">Success stories</h2>
        <TestimonialsMarquee />
      </section>
    </div>
  );
}
