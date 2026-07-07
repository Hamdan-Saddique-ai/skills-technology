import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <nav className="glass flex items-center justify-between rounded-[var(--radius-pill)] px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-[var(--color-ink)]">
          <img src="/logo-mark.svg" alt="" className="h-8 w-8" />
          Skills Technology
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-[var(--color-ink)]/80 transition hover:text-[var(--color-royal)]"
              activeProps={{ className: "text-[var(--color-royal)]" }}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-[var(--color-royal)]">
              Admin
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              to="/auth"
              className="rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              Account
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="brand-gradient glow-ring rounded-[var(--radius-pill)] px-5 py-2 text-sm font-semibold text-white"
              >
                Join
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-royal)]">
              Admin
            </Link>
          )}
          <Link to="/auth" className="brand-gradient mt-2 rounded-lg px-3 py-2 text-center text-sm font-semibold text-white">
            {user ? "Account" : "Join"}
          </Link>
        </div>
      )}
    </header>
  );
}
