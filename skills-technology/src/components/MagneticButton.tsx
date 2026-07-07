import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "a";
  href?: string;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setPos({ x: relX * 0.3, y: relY * 0.3 });
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 });
  }

  const Comp = as === "a" ? motion.a : motion.button;

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
      <Comp
        href={as === "a" ? href : undefined}
        onClick={onClick}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.5 }}
        className={className}
      >
        {children}
      </Comp>
    </div>
  );
}
