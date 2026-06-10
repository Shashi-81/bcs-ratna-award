import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const starsRef = useRef<HTMLCanvasElement>(null);
  const raysRef = useRef<HTMLCanvasElement>(null);
  const bokehRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starsCanvas = starsRef.current;
    const raysCanvas = raysRef.current;
    const bokehCanvas = bokehRef.current;
    const dustCanvas = dustRef.current;
    const grainDiv = grainRef.current;
    if (!starsCanvas || !raysCanvas || !bokehCanvas || !dustCanvas || !grainDiv) return;

    const starsCtx = starsCanvas.getContext("2d")!;
    const raysCtx = raysCanvas.getContext("2d")!;
    const bokehCtx = bokehCanvas.getContext("2d")!;
    const dustCtx = dustCanvas.getContext("2d")!;

    let W = 0, H = 0;
    let animId: number;
    let grainInterval: ReturnType<typeof setInterval>;

    // ── Resize all canvases ──────────────────────────────
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      [starsCanvas, raysCanvas, bokehCanvas, dustCanvas].forEach((c) => {
        c!.width = W;
        c!.height = H;
      });
    }
    resize();
    window.addEventListener("resize", resize);

    // ── STARS ────────────────────────────────────────────
    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.2 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
    }));

    function drawStars(t: number) {
      starsCtx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed * 0.001 + s.phase));
        starsCtx.beginPath();
        starsCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        starsCtx.fillStyle = `rgba(255,245,200,${a.toFixed(3)})`;
        starsCtx.fill();
      }
    }

    // ── GOD RAYS ─────────────────────────────────────────
    const diag = Math.sqrt(W * W + H * H);
    const rays = Array.from({ length: 15 }, (_, i) => ({
      angle: (i / 15) * Math.PI * 2,
      width: 0.005 + Math.random() * 0.02,
      len: (0.7 + Math.random() * 0.5) * diag,
      rotSpeed: (Math.random() * 0.00015 + 0.00005) * (Math.random() < 0.5 ? 1 : -1),
    }));

    function drawRays(t: number) {
      raysCtx.clearRect(0, 0, W, H);
      const ox = W * 0.5;
      const oy = H * 0.42;
      for (const ray of rays) {
        ray.angle += ray.rotSpeed * t * 0.016;
        const a0 = ray.angle - ray.width / 2;
        const a1 = ray.angle + ray.width / 2;
        const x1 = ox + Math.cos(a0) * ray.len;
        const y1 = oy + Math.sin(a0) * ray.len;
        const x2 = ox + Math.cos(a1) * ray.len;
        const y2 = oy + Math.sin(a1) * ray.len;

        const grad = raysCtx.createRadialGradient(ox, oy, 0, ox, oy, ray.len);
        grad.addColorStop(0, "rgba(255,220,80,0.09)");
        grad.addColorStop(0.4, "rgba(255,210,60,0.04)");
        grad.addColorStop(1, "rgba(255,200,40,0)");

        raysCtx.beginPath();
        raysCtx.moveTo(ox, oy);
        raysCtx.lineTo(x1, y1);
        raysCtx.lineTo(x2, y2);
        raysCtx.closePath();
        raysCtx.fillStyle = grad;
        raysCtx.fill();
      }
    }

    // ── BOKEH ─────────────────────────────────────────────
    const orbs = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 8 + Math.random() * 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.1 + Math.random() * 0.3),
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
    }));

    function drawBokeh(t: number) {
      bokehCtx.clearRect(0, 0, W, H);
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.y < -o.r * 2) o.y = H + o.r;
        if (o.x < -o.r * 2) o.x = W + o.r;
        if (o.x > W + o.r * 2) o.x = -o.r;

        const a = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(t * o.speed * 0.001 + o.phase));
        const grad = bokehCtx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(45,90%,70%,${a.toFixed(3)})`);
        grad.addColorStop(0.5, `hsla(45,85%,65%,${(a * 0.4).toFixed(3)})`);
        grad.addColorStop(1, "hsla(45,80%,60%,0)");

        bokehCtx.beginPath();
        bokehCtx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        bokehCtx.fillStyle = grad;
        bokehCtx.fill();
      }
    }

    // ── GOLD DUST ─────────────────────────────────────────
    const dust = Array.from({ length: 110 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.2 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(0.05 + Math.random() * 0.2),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }));

    function drawDust(t: number) {
      dustCtx.clearRect(0, 0, W, H);
      for (const p of dust) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -2) p.y = H + 2;
        if (p.x < -2) p.x = W + 2;
        if (p.x > W + 2) p.x = -2;

        const a = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * p.speed * 0.001 + p.phase));
        dustCtx.beginPath();
        dustCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        dustCtx.fillStyle = `rgba(255,228,80,${a.toFixed(3)})`;
        dustCtx.fill();
      }
    }

    // ── GRAIN FLICKER ─────────────────────────────────────
    let grainStep = 0;
    grainInterval = setInterval(() => {
      grainStep = (grainStep + 1) % 4;
      grainDiv.style.backgroundPosition = `${grainStep * 50}px ${grainStep * 30}px`;
    }, 80);

    // ── RAF LOOP ──────────────────────────────────────────
    let last = 0;
    function loop(ts: number) {
      const dt = ts - last;
      last = ts;
      drawStars(ts);
      drawRays(dt);
      drawBokeh(ts);
      drawDust(ts);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(grainInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>

      {/* Layer 1 — Base gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, #1c1405, #0e0b05, #040300, #000)",
      }} />

      {/* Layer 2 — Stars */}
      <canvas ref={starsRef} style={canvasStyle} />

      {/* Layer 3 — God rays */}
      <canvas ref={raysRef} style={{ ...canvasStyle, mixBlendMode: "screen" }} />

      {/* Layer 4 — Bokeh orbs */}
      <canvas ref={bokehRef} style={{ ...canvasStyle, mixBlendMode: "screen" }} />

      {/* Layer 5 — Gold dust */}
      <canvas ref={dustRef} style={{ ...canvasStyle, mixBlendMode: "screen" }} />

      {/* Layer 6 — Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(0,0,0,0.52) 62%, rgba(0,0,0,0.90) 100%)",
      }} />

      {/* Layer 7 — Film grain */}
      <div
        ref={grainRef}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          opacity: 0.035,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
