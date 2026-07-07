import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-ink)]/10 bg-[var(--color-mist)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <img src="/logo-mark.svg" alt="Skills Technology" className="h-8 w-8" />
            Skills Technology
          </div>
          <p className="mt-3 max-w-xs text-sm text-[var(--color-ink)]/70">
            Practical, creator-focused courses in 3D animation and content automation.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]/60">
            Explore
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-[var(--color-royal)]">All courses</Link></li>
            <li><Link to="/about" className="hover:text-[var(--color-royal)]">About us</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--color-royal)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]/60">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink)]/70">
            <li>hello@sktechnology.org</li>
            <li>Multan, Punjab, Pakistan</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]/60">
            Follow
          </h4>
          <div className="mt-3 flex gap-3">
            <a href="#" aria-label="Instagram" className="glass rounded-full p-2"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="glass rounded-full p-2"><Twitter size={18} /></a>
            <a href="#" aria-label="YouTube" className="glass rounded-full p-2"><Youtube size={18} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-ink)]/10 py-5 text-center text-xs text-[var(--color-ink)]/50">
        © {new Date().getFullYear()} Skills Technology Solutions. All rights reserved.
      </div>
    </footer>
  );
}
