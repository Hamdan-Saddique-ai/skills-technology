import { createFileRoute } from "@tanstack/react-router";
import { CourseForm } from "@/components/admin/CourseForm";

export const Route = createFileRoute("/admin/courses/new")({
  component: NewCoursePage,
});

function NewCoursePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">New course</h1>
      <CourseForm />
    </div>
  );
}
