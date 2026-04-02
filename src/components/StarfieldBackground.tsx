import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // depth 0-1
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: number; // hue
}

interface ThemePalette {
  primaryHue: number;
  headHue: number;
}

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const nebulaRef = useRef<{ x: number; y: number; r: number; hue: number; alpha: number }[]>([]);
  const paletteRef = useRef<ThemePalette>({ primaryHue: 43, headHue: 45 });

  const readThemePalette = useCallback(() => {
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim();
    const primaryHue = Number.parseFloat(primary.split(" ")[0]) || 43;
    paletteRef.current = { primaryHue, headHue: Math.min(primaryHue + 8, 359) };
  }, []);

  const initStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      const z = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z,
        size: 0.3 + z * 2,
        baseAlpha: 0.1 + z * 0.6,
        twinkleSpeed: 0.003 + Math.random() * 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7 ? 200 + Math.random() * 30 : 40 + Math.random() * 10,
      });
    }
    starsRef.current = stars;

    // Nebula clouds
    const nebulae = [];
    for (let i = 0; i < 4; i++) {
      nebulae.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 150 + Math.random() * 250,
        hue: i % 2 === 0 ? 43 : 220,
        alpha: 0.015 + Math.random() * 0.015,
      });
    }
    nebulaRef.current = nebulae;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    readThemePalette();
    const observer = new MutationObserver(() => readThemePalette());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Shooting stars
    const shooters: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
    let lastShooter = 0;

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;

      // Clear with subtle gradient
      ctx.clearRect(0, 0, w, h);

      // Draw nebula clouds
      for (const neb of nebulaRef.current) {
        const px = neb.x + mx * 8;
        const py = neb.y + my * 8;
        const pulse = Math.sin(time * 0.0003 + neb.hue) * 0.3 + 0.7;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, neb.r);
        gradient.addColorStop(0, `hsla(${neb.hue}, 70%, 40%, ${neb.alpha * pulse})`);
        gradient.addColorStop(0.5, `hsla(${neb.hue}, 60%, 30%, ${neb.alpha * pulse * 0.3})`);
        gradient.addColorStop(1, `hsla(${neb.hue}, 50%, 20%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, neb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw stars
      for (const star of starsRef.current) {
        const parallax = star.z * 6;
        const px = star.x + mx * parallax;
        const py = star.y + my * parallax;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.baseAlpha * (0.6 + twinkle * 0.4);

        // Glow for brighter stars
        if (star.z > 0.5) {
          const gr = ctx.createRadialGradient(px, py, 0, px, py, star.size * 5);
          gr.addColorStop(0, `hsla(${star.color}, 80%, 60%, ${alpha * 0.25})`);
          gr.addColorStop(1, `hsla(${star.color}, 80%, 60%, 0)`);
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cross-flare for brightest stars
        if (star.z > 0.8) {
          ctx.strokeStyle = `hsla(${star.color}, 90%, 80%, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          const flareLen = star.size * 4;
          ctx.beginPath();
          ctx.moveTo(px - flareLen, py);
          ctx.lineTo(px + flareLen, py);
          ctx.moveTo(px, py - flareLen);
          ctx.lineTo(px, py + flareLen);
          ctx.stroke();
        }

        // Core
        ctx.fillStyle = `hsla(${star.color}, 100%, ${75 + twinkle * 15}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      if (time - lastShooter > 3000 + Math.random() * 5000) {
        lastShooter = time;
        const angle = Math.PI * 0.2 + Math.random() * 0.3;
        shooters.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.3,
          vx: Math.cos(angle) * (4 + Math.random() * 3),
          vy: Math.sin(angle) * (4 + Math.random() * 3),
          life: 0,
          maxLife: 50 + Math.random() * 30,
          size: 1 + Math.random(),
        });
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        const { primaryHue, headHue } = paletteRef.current;
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.15 ? progress / 0.15 : 1 - progress;

        // Trail
        const trailLen = 20;
        const gradient = ctx.createLinearGradient(
          s.x, s.y, s.x - s.vx * trailLen, s.y - s.vy * trailLen
        );
        gradient.addColorStop(0, `hsla(${primaryHue}, 96%, 80%, ${alpha * 0.9})`);
        gradient.addColorStop(1, `hsla(${primaryHue}, 96%, 80%, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * trailLen, s.y - s.vy * trailLen);
        ctx.stroke();

        // Head
        ctx.fillStyle = `hsla(${headHue}, 100%, 90%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (s.life >= s.maxLife) shooters.splice(i, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [initStars, readThemePalette]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, hsl(var(--space-top)) 0%, hsl(var(--space-deep)) 50%, hsl(var(--space-bottom)) 100%)",
      }}
    />
  );
};

export default StarfieldBackground;
