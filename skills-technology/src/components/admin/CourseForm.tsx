import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { upsertCourse } from "@/server/admin";
import type { Category, Course } from "@/lib/types";

interface CourseFormProps {
  initial?: Course;
}

const emptyForm = {
  title: "",
  slug: "",
  category_id: "" as string,
  description: "",
  image_url: "" as string,
  price: 0,
  discounted_price: "" as string,
  is_premium: false,
  is_vip: false,
};

export function CourseForm({ initial }: CourseFormProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          slug: initial.slug,
          category_id: initial.category_id ?? "",
          description: initial.description,
          image_url: initial.image_url ?? "",
          price: initial.price,
          discounted_price: initial.discounted_price?.toString() ?? "",
          is_premium: initial.is_premium,
          is_vip: initial.is_vip,
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => data && setCategories(data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: session } = await supabase.auth.getSession();
    const accessToken = session.session?.access_token;
    if (!accessToken) {
      setError("You must be signed in as an admin.");
      setSaving(false);
      return;
    }

    let imageUrl = form.image_url || null;
    if (imageFile) {
      const path = `${crypto.randomUUID()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("course-images")
        .upload(path, imageFile, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("course-images").getPublicUrl(path);
      imageUrl = publicUrl.publicUrl;
    }

    try {
      await upsertCourse({
        data: {
          accessToken,
          id: initial?.id,
          course: {
            title: form.title,
            slug: form.slug,
            category_id: form.category_id || null,
            description: form.description,
            image_url: imageUrl,
            price: Number(form.price),
            discounted_price: form.discounted_price ? Number(form.discounted_price) : null,
            is_premium: form.is_premium,
            is_vip: form.is_vip,
          },
        },
      });
      navigate({ to: "/admin/courses" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-[var(--radius-card)] p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input"
          />
        </Field>
        <Field label="Slug">
          <input
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="input"
            placeholder="course-slug"
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          value={form.category_id}
          onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
          className="input"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label="Course image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        {form.image_url && !imageFile && (
          <img src={form.image_url} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />
        )}
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Price ($)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className="input"
          />
        </Field>
        <Field label="Discounted price ($, optional)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.discounted_price}
            onChange={(e) => setForm((f) => ({ ...f, discounted_price: e.target.value }))}
            className="input"
          />
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_premium}
            onChange={(e) => setForm((f) => ({ ...f, is_premium: e.target.checked }))}
          />
          Premium
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_vip}
            onChange={(e) => setForm((f) => ({ ...f, is_vip: e.target.checked }))}
          />
          VIP
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="brand-gradient glow-ring rounded-[var(--radius-pill)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : initial ? "Save changes" : "Create course"}
      </button>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid rgb(10 26 61 / 0.1);
          background: rgb(255 255 255 / 0.7);
          border-radius: 0.75rem;
          padding: 0.55rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--color-royal);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
