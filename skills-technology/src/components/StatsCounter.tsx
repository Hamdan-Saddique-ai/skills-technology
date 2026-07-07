import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

function useCountUp(target: number, inView: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;

    function tick(t: number) {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
}

function Stat({ value, suffix = "", label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const display = useCountUp(value, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-bold text-[var(--color-royal)] md:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--color-ink)]/60">{label}</div>
    </div>
  );
}

export function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass mx-auto grid max-w-4xl grid-cols-3 gap-6 rounded-[var(--radius-card)] px-6 py-10"
    >
      <Stat value={4200} suffix="+" label="Students" />
      <Stat value={38} suffix="" label="Courses" />
      <Stat value={96} suffix="%" label="Success rate" />
    </motion.div>
  );
}
