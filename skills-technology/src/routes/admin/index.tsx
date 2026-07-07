import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ courses: 0, categories: 0, messages: 0 });
  const [recent, setRecent] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const [coursesRes, categoriesRes, messagesRes, recentRes] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setCounts({
        courses: coursesRes.count ?? 0,
        categories: categoriesRes.count ?? 0,
        messages: messagesRes.count ?? 0,
      });
      if (recentRes.data) setRecent(recentRes.data);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass rounded-[var(--radius-card)] p-6">
          <div className="font-display text-3xl font-bold text-[var(--color-royal)]">{counts.courses}</div>
          <div className="text-sm text-[var(--color-ink)]/60">Courses</div>
        </div>
        <div className="glass rounded-[var(--radius-card)] p-6">
          <div className="font-display text-3xl font-bold text-[var(--color-royal)]">{counts.categories}</div>
          <div className="text-sm text-[var(--color-ink)]/60">Categories</div>
        </div>
        <div className="glass rounded-[var(--radius-card)] p-6">
          <div className="font-display text-3xl font-bold text-[var(--color-royal)]">{counts.messages}</div>
          <div className="text-sm text-[var(--color-ink)]/60">Contact messages</div>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-card)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent courses</h2>
          <Link to="/admin/courses" className="text-sm font-semibold text-[var(--color-royal)]">
            Manage all →
          </Link>
        </div>
        <ul className="divide-y divide-[var(--color-ink)]/10">
          {recent.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3 text-sm">
              <span>{c.title}</span>
              <span className="text-[var(--color-ink)]/50">
                {c.price === 0 ? "Free" : `$${c.price.toFixed(0)}`}
              </span>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="py-3 text-sm text-[var(--color-ink)]/50">No courses yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
