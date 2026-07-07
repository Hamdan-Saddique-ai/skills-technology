import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { deleteCourse } from "@/server/admin";
import type { Course } from "@/lib/types";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCoursesList,
});

function AdminCoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) setCourses(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this course? This can't be undone.")) return;
    setBusyId(id);
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (!accessToken) return;
    await deleteCourse({ data: { accessToken, id } });
    await load();
    setBusyId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <Link
          to="/admin/courses/new"
          className="brand-gradient flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New course
        </Link>
      </div>

      <div className="glass overflow-hidden rounded-[var(--radius-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-ink)]/10 text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Flags</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ink)]/10">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-medium">{c.title}</td>
                <td className="px-5 py-3">
                  {c.price === 0 ? "Free" : `$${c.price.toFixed(0)}`}
                  {c.discounted_price != null && ` → $${c.discounted_price.toFixed(0)}`}
                </td>
                <td className="px-5 py-3 text-xs text-[var(--color-ink)]/60">
                  {c.is_premium && "Premium "}
                  {c.is_vip && "VIP"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <Link to="/admin/courses/$id" params={{ id: c.id }} className="text-[var(--color-royal)]">
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={busyId === c.id}
                      className="text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-ink)]/50">
                  No courses yet — create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
