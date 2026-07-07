import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * FloatingLogo
 * ------------
 * The uploaded blue 3D building mark, floating in the hero. Slow constant
 * rotation + drift, plus a parallax tilt that follows the mouse. Respects
 * prefers-reduced-motion by freezing the rotation/parallax (logo still
 * renders, just static).
 */
export function FloatingLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 15 });

  const rotateY = useTransform(springX, [-1, 1], [-15, 15]);
  const rotateX = useTransform(springY, [-1, 1], [15, -15]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    function handleMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (window.innerWidth / 2));
      mouseY.set((e.clientY - cy) / (window.innerHeight / 2));
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative mx-auto h-72 w-72 md:h-96 md:w-96"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <motion.img
          src="/logo-mark-3d.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full drop-shadow-[0_30px_60px_rgba(30,58,237,0.35)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
