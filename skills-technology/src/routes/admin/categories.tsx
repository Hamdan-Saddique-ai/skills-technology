import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { upsertCategory, deleteCategory } from "@/server/admin";
import type { Category } from "@/lib/types";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (!accessToken) {
      setError("You must be signed in as an admin.");
      setSaving(false);
      return;
    }

    try {
      await upsertCategory({ data: { accessToken, name, slug: slugify(name) } });
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Courses in it will become uncategorized.")) return;
    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (!accessToken) return;
    await deleteCategory({ data: { accessToken, id } });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Categories</h1>

      <form onSubmit={handleAdd} className="glass flex max-w-md gap-3 rounded-[var(--radius-card)] p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-xl border border-[var(--color-ink)]/10 bg-white/70 px-4 py-2 text-sm outline-none focus:border-[var(--color-royal)]"
        />
        <button
          type="submit"
          disabled={saving}
          className="brand-gradient flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Plus size={16} /> Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="glass max-w-md divide-y divide-[var(--color-ink)]/10 rounded-[var(--radius-card)]">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <span>{c.name}</span>
            <button onClick={() => handleDelete(c.id)} className="text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[var(--color-ink)]/50">No categories yet.</div>
        )}
      </div>
    </div>
  );
}
