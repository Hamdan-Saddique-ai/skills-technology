interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  { name: "Ayesha K.", role: "3D Animation Reels grad", quote: "Went from zero to my first paid client in six weeks." },
  { name: "Bilal R.", role: "TikTok Automation grad", quote: "Automated my whole posting pipeline — huge time saver." },
  { name: "Sana M.", role: "3D Animation Reels grad", quote: "The curriculum is dense but every lesson is usable immediately." },
  { name: "Hamza T.", role: "VIP member", quote: "Direct feedback from instructors made all the difference." },
  { name: "Mahnoor Z.", role: "TikTok Automation grad", quote: "Doubled my account's engagement within the first month." },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <div className="glass mx-3 w-80 shrink-0 rounded-[var(--radius-card)] p-6">
      <p className="text-sm leading-relaxed text-[var(--color-ink)]/80">"{t.quote}"</p>
      <div className="mt-4 font-display text-sm font-semibold">{t.name}</div>
      <div className="text-xs text-[var(--color-ink)]/50">{t.role}</div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <div className="overflow-hidden py-4">
      <div className="marquee-track">
        {items.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}
