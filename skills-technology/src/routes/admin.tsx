import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Tags, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [{ title: "Admin — Skills Technology Solutions" }],
  }),
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="py-24 text-center text-[var(--color-ink)]/50">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="glass mx-auto max-w-md rounded-[var(--radius-card)] p-8 text-center">
        <h1 className="font-display text-xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-sm text-[var(--color-ink)]/65">
          Sign in with an admin account to view this page.
        </p>
        <Link
          to="/auth"
          className="brand-gradient mt-6 inline-block rounded-[var(--radius-pill)] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <aside className="glass h-fit rounded-[var(--radius-card)] p-4">
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-ink)]/75 transition hover:bg-[var(--color-royal)]/10"
              activeProps={{ className: "bg-[var(--color-royal)]/10 text-[var(--color-royal)]" }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
