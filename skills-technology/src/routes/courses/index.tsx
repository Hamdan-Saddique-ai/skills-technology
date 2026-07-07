import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category, Course } from "@/lib/types";
import { CourseCard } from "@/components/CourseCard";

export const Route = createFileRoute("/courses/")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "All courses — Skills Technology Solutions" },
      { name: "description", content: "Browse every course, filterable by category." },
    ],
  }),
});

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => data && setCourses(data));

    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => data && setCategories(data));
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = !activeCategory || c.category_id === activeCategory;
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [courses, activeCategory, query]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">All courses</h1>
        <p className="mt-2 text-[var(--color-ink)]/65">
          Search and filter every course we offer.
        </p>
      </div>

      <div className="glass flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2.5">
        <Search size={18} className="text-[var(--color-ink)]/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-ink)]/40"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === null
              ? "brand-gradient text-white"
              : "glass text-[var(--color-ink)]/70"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.id
                ? "brand-gradient text-white"
                : "glass text-[var(--color-ink)]/70"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-[var(--color-ink)]/50">
          No courses match — try a different search or category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
