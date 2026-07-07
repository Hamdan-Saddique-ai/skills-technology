import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

/**
 * Server-side Supabase client using the service role key. Only ever used
 * inside these server functions, never sent to the client bundle. Combined
 * with the explicit admin role check below, this gives defense-in-depth
 * on top of the RLS policies already enforced on the tables themselves.
 */
function serviceClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * requireAdmin
 * ------------
 * Validates the bearer access token passed from the client, then checks
 * the `has_role` function for the `admin` role. Throws if either check
 * fails. Call this at the top of every admin server function.
 */
async function requireAdmin(accessToken: string) {
  const client = serviceClient();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser(accessToken);

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: isAdmin, error: roleError } = await client.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (roleError || !isAdmin) {
    throw new Error("Admin role required");
  }

  return { client, user };
}

interface CourseInput {
  title: string;
  slug: string;
  category_id: string | null;
  description: string;
  image_url: string | null;
  price: number;
  discounted_price: number | null;
  is_premium: boolean;
  is_vip: boolean;
}

export const upsertCourse = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string; id?: string; course: CourseInput }) => d)
  .handler(async ({ data }) => {
    const { client } = await requireAdmin(data.accessToken);

    if (data.id) {
      const { error } = await client
        .from("courses")
        .update(data.course)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.from("courses").insert(data.course);
      if (error) throw new Error(error.message);
    }
    return { success: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string; id: string }) => d)
  .handler(async ({ data }) => {
    const { client } = await requireAdmin(data.accessToken);
    const { error } = await client.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const upsertCategory = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string; id?: string; name: string; slug: string }) => d)
  .handler(async ({ data }) => {
    const { client } = await requireAdmin(data.accessToken);

    if (data.id) {
      const { error } = await client
        .from("categories")
        .update({ name: data.name, slug: data.slug })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client
        .from("categories")
        .insert({ name: data.name, slug: data.slug });
      if (error) throw new Error(error.message);
    }
    return { success: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string; id: string }) => d)
  .handler(async ({ data }) => {
    const { client } = await requireAdmin(data.accessToken);
    const { error } = await client.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const listContactMessages = createServerFn({ method: "POST" })
  .validator((d: { accessToken: string }) => d)
  .handler(async ({ data }) => {
    const { client } = await requireAdmin(data.accessToken);
    const { data: messages, error } = await client
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return messages;
  });
