import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { CourseForm } from "@/components/admin/CourseForm";
import type { Course } from "@/lib/types";

export const Route = createFileRoute("/admin/courses/$id")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();
    if (error || !data) throw notFound();
    return data as Course;
  },
  component: EditCoursePage,
});

function EditCoursePage() {
  const course = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Edit course</h1>
      <CourseForm initial={course} />
    </div>
  );
}
