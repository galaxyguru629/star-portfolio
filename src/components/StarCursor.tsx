import { useEffect, useRef } from "react";

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  spin: number;
}

interface BurstParticle {
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  size: number;
}

interface ClickBurst {
  x: number;
  y: number;
  particles: BurstParticle[];
  ringLife: number;
  flashLife: number;
}

const StarCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailParticle[]>([]);
  const isHoveringRef = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const colorRef = useRef({ glow: "255, 215, 112", star: "255, 235, 170", core: "255, 250, 230" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const readThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const glow = styles.getPropertyValue("--star-rgb").trim() || "255, 215, 112";
      const head = styles.getPropertyValue("--star-head-rgb").trim() || "255, 250, 230";
      colorRef.current = { glow, star: head, core: "255, 255, 255" };
    };
    readThemeColors();
    const observer = new MutationObserver(() => readThemeColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      isHoveringRef.current = !!target.closest("a, button, [role=button], input, textarea, [data-interactive]");
    };

    const bursts: ClickBurst[] = [];

    const handleClick = (e: MouseEvent) => {
      const particles: BurstParticle[] = [];
      const count = 20;
      for (let i = 0; i < count; i++) {
        particles.push({
          angle: (i / count) * Math.PI * 2 + Math.random() * 0.2,
          speed: 3 + Math.random() * 5,
          life: 1,
          maxLife: 0.9 + Math.random() * 0.6,
          size: 3 + Math.random() * 6,
        });
      }
      bursts.push({ x: e.clientX, y: e.clientY, particles, ringLife: 1, flashLife: 1 });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("click", handleClick);

    const drawStar = (cx: number, cy: number, r: number, alpha: number, rotation = 0) => {
      if (alpha < 0.01 || r < 0.5) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // Halo glow
      ctx.fillStyle = `rgba(${colorRef.current.glow}, ${alpha * 0.22})`;
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Crystal star body
      ctx.fillStyle = `rgba(${colorRef.current.star}, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? r : r * 0.42;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Facet overlay
      ctx.fillStyle = `rgba(${colorRef.current.glow}, ${alpha * 0.25})`;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.88);
      ctx.lineTo(r * 0.33, -r * 0.1);
      ctx.lineTo(0, r * 0.22);
      ctx.lineTo(-r * 0.33, -r * 0.1);
      ctx.closePath();
      ctx.fill();

      // Core
      ctx.fillStyle = `rgba(${colorRef.current.core}, ${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let lastTime = 0;
    const draw = (time: number) => {
      const dt = Math.min(time - lastTime, 32) / 16; // normalize to ~60fps
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Smooth interpolation for cursor position (lerp)
      const lerp = 0.28;
      const prevX = posRef.current.x;
      const prevY = posRef.current.y;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp * dt;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp * dt;
      velocityRef.current.x = posRef.current.x - prevX;
      velocityRef.current.y = posRef.current.y - prevY;

      const { x, y } = posRef.current;
      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);

      // Add rich comet-like trail particles
      const spawnCount = isHoveringRef.current ? 3 : 2;
      for (let si = 0; si < spawnCount; si++) {
        trailRef.current.push({
          x: x - velocityRef.current.x * (1 + si * 0.35),
          y: y - velocityRef.current.y * (1 + si * 0.35),
          vx: -velocityRef.current.x * 0.18 + (Math.random() - 0.5) * 0.45,
          vy: -velocityRef.current.y * 0.18 + (Math.random() - 0.5) * 0.45,
          life: 1,
          maxLife: 0.5 + Math.random() * 0.8,
          size: (isHoveringRef.current ? 5.5 : 4.2) + Math.random() * 2.8,
          spin: (Math.random() - 0.5) * 0.4,
        });
      }
      if (trailRef.current.length > 80) {
        trailRef.current.splice(0, trailRef.current.length - 80);
      }

      // Draw trail
      for (let i = trailRef.current.length - 1; i >= 0; i--) {
        const p = trailRef.current[i];
        const fadeSpeed = 0.02 / p.maxLife;
        p.life -= fadeSpeed * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.size *= 0.985;
        if (p.life <= 0) {
          trailRef.current.splice(i, 1);
          continue;
        }
        drawStar(p.x, p.y, p.size, p.life * 0.7, p.spin * time * 0.01);
      }

      // Draw click "star nuclear bomb" bursts
      for (let bi = bursts.length - 1; bi >= 0; bi--) {
        const b = bursts[bi];
        b.ringLife -= 0.028 * dt;
        b.flashLife -= 0.07 * dt;

        // Expanding shockwave ring
        if (b.ringLife > 0) {
          const progress = 1 - b.ringLife;
          const radius = 15 + progress * 140;
          ctx.save();
          ctx.strokeStyle = `rgba(${colorRef.current.glow}, ${b.ringLife * 0.6})`;
          ctx.lineWidth = 2 + b.ringLife * 5;
          ctx.beginPath();
          ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Initial flash bloom
        if (b.flashLife > 0) {
          const fr = 12 + (1 - b.flashLife) * 75;
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, fr);
          grad.addColorStop(0, `rgba(${colorRef.current.core}, ${b.flashLife * 0.95})`);
          grad.addColorStop(0.4, `rgba(${colorRef.current.glow}, ${b.flashLife * 0.55})`);
          grad.addColorStop(1, `rgba(${colorRef.current.glow}, 0)`);
          ctx.save();
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, fr, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        let alive = b.ringLife > 0 || b.flashLife > 0;
        for (const p of b.particles) {
          if (p.life <= 0) continue;
          alive = true;
          p.life -= (0.035 / p.maxLife) * dt;
          const progress = 1 - p.life;
          const dist = progress * (35 + p.speed * 20);
          const px = b.x + Math.cos(p.angle) * dist * p.speed;
          const py = b.y + Math.sin(p.angle) * dist * p.speed;
          drawStar(px, py, p.size * p.life, p.life * 0.9, progress * 8);
        }
        if (!alive) bursts.splice(bi, 1);
      }

      // Main cursor
      const pulse = 0.86 + Math.sin(time * 0.015) * 0.2;
      const cursorSize = (isHoveringRef.current ? 13 : 9) + Math.min(speed * 0.35, 5);
      drawStar(x, y, cursorSize * pulse, 1, time * 0.012);

      // Aura ring around main cursor
      ctx.save();
      ctx.strokeStyle = `rgba(${colorRef.current.glow}, ${isHoveringRef.current ? 0.5 : 0.35})`;
      ctx.lineWidth = isHoveringRef.current ? 2.2 : 1.5;
      ctx.beginPath();
      ctx.arc(x, y, cursorSize * (isHoveringRef.current ? 1.9 : 1.5), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      requestAnimationFrame(draw);
    };
    const anim = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(anim);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
};

export default StarCursor;
