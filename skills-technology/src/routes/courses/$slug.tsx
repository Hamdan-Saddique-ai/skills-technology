import { createFileRoute, notFound } from "@tanstack/react-router";
import { CheckCircle2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/lib/types";
import { MagneticButton } from "@/components/MagneticButton";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("courses")
      .select("*, category:categories(*)")
      .eq("slug", params.slug)
      .maybeSingle();

    if (error || !data) throw notFound();
    return data as Course;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Course"} — Skills Technology Solutions` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:image", content: loaderData?.image_url ?? "" },
    ],
  }),
  component: CourseDetailPage,
});

// Placeholder curriculum shown until real curriculum data is wired into
// the `courses` table (add a `curriculum` jsonb column when ready).
const PLACEHOLDER_CURRICULUM = [
  "Orientation & tool setup",
  "Core technique walkthrough",
  "Guided project build",
  "Feedback & revision round",
  "Publish & showcase",
];

function CourseDetailPage() {
  const course = Route.useLoaderData();
  const hasDiscount =
    course.discounted_price != null && course.discounted_price < course.price;

  return (
    <div className="space-y-10">
      <div className="glass overflow-hidden rounded-[var(--radius-card)]">
        <div className="relative h-64 w-full bg-gradient-to-br from-[var(--color-royal)] to-[var(--color-sky)] md:h-80">
          {course.image_url && (
            <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3">
            {course.is_vip && (
              <span className="rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold text-white">
                VIP
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-[var(--color-ink)]/70">
              <Star size={14} className="fill-[var(--color-sky)] text-[var(--color-sky)]" />
              {course.rating.toFixed(1)}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-[var(--color-ink)]/70">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-lg text-[var(--color-ink)]/40 line-through">
                  ${course.price.toFixed(0)}
                </span>
              )}
              <span className="font-display text-3xl font-bold text-[var(--color-royal)]">
                {course.price === 0
                  ? "Free"
                  : `$${(course.discounted_price ?? course.price).toFixed(0)}`}
              </span>
            </div>
            <MagneticButton
              as="a"
              href="/auth"
              className="brand-gradient glow-ring rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold text-white"
            >
              Enroll now
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="glass rounded-[var(--radius-card)] p-6 md:col-span-2">
          <h2 className="font-display text-xl font-semibold">Curriculum</h2>
          <ul className="mt-4 space-y-3">
            {PLACEHOLDER_CURRICULUM.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-ink)]/75">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--color-royal)]" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-[var(--radius-card)] p-6">
          <h2 className="font-display text-xl font-semibold">Instructor</h2>
          <p className="mt-3 text-sm text-[var(--color-ink)]/70">
            Taught by the Skills Technology core team — instructor bios can
            be added here once provided.
          </p>
        </div>
      </div>
    </div>
  );
}
