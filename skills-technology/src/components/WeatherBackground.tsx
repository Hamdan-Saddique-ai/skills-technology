import { useEffect, useRef } from "react";

/**
 * WeatherBackground
 * ------------------
 * A single canvas that auto-cycles through five ambient scenes every
 * ~20s: clear sky -> drifting clouds -> rain -> snow -> sunset -> (loop).
 * Mounted once in __root.tsx behind the whole app. Pure canvas + CSS,
 * no external animation libs so it stays light and smooth.
 *
 * Respects `prefers-reduced-motion`: renders a single static gradient
 * frame and skips the animation loop entirely.
 */

type Scene = "clear" | "clouds" | "rain" | "snow" | "sunset";
const SCENES: Scene[] = ["clear", "clouds", "rain", "snow", "sunset"];
const SCENE_DURATION_MS = 20000;
const TRANSITION_MS = 2500;

const SCENE_GRADIENTS: Record<Scene, [string, string]> = {
  clear: ["#eaf3ff", "#ffffff"],
  clouds: ["#dfe9fb", "#f3f7ff"],
  rain: ["#c9d9f5", "#eef2fb"],
  snow: ["#e8eefc", "#ffffff"],
  sunset: ["#ffe3d6", "#eaf0ff"],
};

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

export function WeatherBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Reduced motion: draw one static gradient (clear sky) and stop.
    if (reduceMotion) {
      const [top, bottom] = SCENE_GRADIENTS.clear;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, top);
      grad.addColorStop(1, bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      return () => window.removeEventListener("resize", handleResize);
    }

    let sceneIndex = 0;
    let sceneStart = performance.now();
    let raf = 0;

    // Particle pools, sized generously and reused across scene switches.
    const clouds: Particle[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4,
      size: 80 + Math.random() * 120,
      speed: 0.15 + Math.random() * 0.2,
      drift: 0,
      opacity: 0.35 + Math.random() * 0.25,
    }));

    const rainDrops: Particle[] = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 10,
      speed: 6 + Math.random() * 6,
      drift: -1,
      opacity: 0.25 + Math.random() * 0.25,
    }));

    const snowFlakes: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 2.5,
      speed: 0.6 + Math.random() * 0.8,
      drift: Math.random() * 2 - 1,
      opacity: 0.5 + Math.random() * 0.4,
    }));

    function drawSky(scene: Scene, alpha: number) {
      const [top, bottom] = SCENE_GRADIENTS[scene];
      const grad = ctx!.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, top);
      grad.addColorStop(1, bottom);
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);
      ctx!.globalAlpha = 1;
    }

    function drawClouds(alpha: number) {
      for (const c of clouds) {
        c.x += c.speed;
        if (c.x - c.size > width) c.x = -c.size;
        ctx!.globalAlpha = c.opacity * alpha;
        ctx!.fillStyle = "#ffffff";
        ctx!.beginPath();
        ctx!.ellipse(c.x, c.y, c.size, c.size * 0.5, 0, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function drawRain(alpha: number) {
      ctx!.strokeStyle = "#4fa8ff";
      for (const d of rainDrops) {
        d.y += d.speed;
        d.x += d.drift;
        if (d.y > height) {
          d.y = -10;
          d.x = Math.random() * width;
        }
        ctx!.globalAlpha = d.opacity * alpha;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(d.x, d.y);
        ctx!.lineTo(d.x + d.drift * 3, d.y + d.size);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function drawSnow(alpha: number) {
      ctx!.fillStyle = "#ffffff";
      for (const s of snowFlakes) {
        s.y += s.speed;
        s.x += s.drift * 0.5;
        if (s.y > height) {
          s.y = -5;
          s.x = Math.random() * width;
        }
        ctx!.globalAlpha = s.opacity * alpha;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function drawSun(scene: Scene, alpha: number) {
      const cx = width * 0.82;
      const cy = scene === "sunset" ? height * 0.35 : height * 0.15;
      const r = scene === "sunset" ? 90 : 60;
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2);
      grad.addColorStop(
        0,
        scene === "sunset" ? "rgba(255,170,120,0.55)" : "rgba(255,255,255,0.7)"
      );
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    function render(now: number) {
      const elapsed = now - sceneStart;
      const scene = SCENES[sceneIndex];
      const nextScene = SCENES[(sceneIndex + 1) % SCENES.length];

      // Crossfade over the final TRANSITION_MS of each scene's duration.
      const fadeStart = SCENE_DURATION_MS - TRANSITION_MS;
      let currentAlpha = 1;
      let nextAlpha = 0;
      if (elapsed > fadeStart) {
        nextAlpha = Math.min(1, (elapsed - fadeStart) / TRANSITION_MS);
        currentAlpha = 1 - nextAlpha;
      }

      ctx!.clearRect(0, 0, width, height);
      drawSky(scene, 1);
      if (nextAlpha > 0) drawSky(nextScene, nextAlpha);

      // Foreground effects for whichever scene(s) are active.
      if (scene === "clouds" || nextScene === "clouds") drawClouds(1);
      if (scene === "rain" || nextScene === "rain") drawRain(1);
      if (scene === "snow" || nextScene === "snow") drawSnow(1);
      if (scene === "sunset" || nextScene === "sunset")
        drawSun("sunset", scene === "sunset" ? currentAlpha : nextAlpha);
      if (scene === "clear") drawSun("clear", currentAlpha);

      if (elapsed >= SCENE_DURATION_MS) {
        sceneIndex = (sceneIndex + 1) % SCENES.length;
        sceneStart = now;
      }

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="weather-bg-canvas" ref={canvasRef} aria-hidden="true" />;
}
