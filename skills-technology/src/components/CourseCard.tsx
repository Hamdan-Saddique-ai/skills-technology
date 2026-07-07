import Tilt from "react-parallax-tilt";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  const hasDiscount =
    course.discounted_price != null && course.discounted_price < course.price;

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      glareEnable
      glareMaxOpacity={0.15}
      glareColor="#4FA8FF"
      glarePosition="all"
      scale={1.02}
      transitionSpeed={1200}
      className="group relative"
    >
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="glass block overflow-hidden rounded-[var(--radius-card)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-glow-md)]"
      >
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[var(--color-royal)] to-[var(--color-sky)]">
          {course.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-2xl font-bold text-white/90">
              {course.title.slice(0, 1)}
            </div>
          )}

          {course.is_vip && (
            <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold text-white">
              VIP
            </span>
          )}

          <span className="absolute -right-10 top-4 rotate-45 bg-[var(--color-royal)] px-10 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
            Enroll
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {course.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--color-ink)]/65">
            {course.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-[var(--color-ink)]/70">
              <Star size={14} className="fill-[var(--color-sky)] text-[var(--color-sky)]" />
              {course.rating.toFixed(1)}
            </div>

            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-sm text-[var(--color-ink)]/40 line-through">
                  ${course.price.toFixed(0)}
                </span>
              )}
              <span className="font-display text-base font-bold text-[var(--color-royal)]">
                {course.price === 0
                  ? "Free"
                  : `$${(course.discounted_price ?? course.price).toFixed(0)}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
