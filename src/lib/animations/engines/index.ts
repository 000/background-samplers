import type { AnimationEngine, AnimationHandle } from "../types";
import { SimplexNoise, clamp, createLoop, mix, resizeCanvas, smoothstep } from "./utils";

function emptyHandle(): AnimationHandle {
  return { destroy: () => {} };
}

/** 2018–early 2025: plain static surface, no motion. */
export const staticEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    const paint = () => {
      const { w, h, dpr } = resizeCanvas(canvas);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f8f8f9");
      g.addColorStop(1, "#ebebed");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.015)";
      for (let i = 0; i < 400; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
    };
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    void reducedMotion;
    return {
      destroy: () => window.removeEventListener("resize", onResize),
    };
  },
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  color: string;
  vx: number;
  vy: number;
};

/** Aug 2025 (503c86e): mouse-repulsion blue particle field. */
export const blueFieldEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    let particles: Particle[] = [];
    const mouse = { x: -1e4, y: -1e4, radius: 150 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      particles = [];
      const n = Math.min(Math.floor((w * h) / 15000), 120);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 1,
          density: Math.random() * 30 + 1,
          color: `rgba(37, 99, 235, ${Math.random() * 0.35 + 0.12})`,
          vx: 0,
          vy: 0,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let meshPhase = 0;

    const loop = createLoop(reducedMotion, (dt) => {
      meshPhase += dt * 0.03;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(meshPhase);
      ctx.translate(-w / 2, -h / 2);
      const orbs = [
        { x: w * 0.2, y: h * 0.8, c: "rgba(37,99,235,0.08)" },
        { x: w * 0.8, y: h * 0.2, c: "rgba(139,92,246,0.07)" },
        { x: w * 0.4, y: h * 0.4, c: "rgba(14,165,233,0.06)" },
      ];
      for (const o of orbs) {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, Math.max(w, h) * 0.35);
        g.addColorStop(0, o.c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * p.density;
          p.y -= (dy / dist) * force * p.density;
        } else {
          p.x -= (p.x - p.baseX) / 10;
          p.y -= (p.y - p.baseY) / 10;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      },
    };
  },
};

/** Nov 2025 (9f728eb): denser multi-color elite cyber particles. */
export const eliteCyberEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    let particles: Particle[] = [];
    const mouse = { x: -1e4, y: -1e4, radius: 160 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const colors = () => [
      `rgba(14, 165, 233, ${Math.random() * 0.4 + 0.15})`,
      `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.12})`,
      `rgba(236, 72, 153, ${Math.random() * 0.3 + 0.08})`,
      `rgba(34, 211, 238, ${Math.random() * 0.35 + 0.1})`,
    ];

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      particles = [];
      const n = Math.min(Math.floor((w * h) / 10000), 160);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const c = colors();
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2.2 + 0.8,
          density: Math.random() * 28 + 2,
          color: c[Math.floor(Math.random() * c.length)]!,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const loop = createLoop(reducedMotion, () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(14,165,233,0.03)";
      for (let x = 0; x < w; x += 48) ctx.fillRect(x, 0, 1, h);
      for (let y = 0; y < h; y += 48) ctx.fillRect(0, y, w, 1);

      for (const p of particles) {
        p.baseX += p.vx * 0.15;
        p.baseY += p.vy * 0.15;
        if (p.baseX < 0) p.baseX = w;
        if (p.baseX > w) p.baseX = 0;
        if (p.baseY < 0) p.baseY = h;
        if (p.baseY > h) p.baseY = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * p.density * 0.55;
          p.y -= (dy / dist) * force * p.density * 0.55;
        } else {
          p.x -= (p.x - p.baseX) / 18;
          p.y -= (p.y - p.baseY) / 18;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      },
    };
  },
};

/** Nov 2025 / Jan 2026: particles with connection graph (protocol network). */
export const protocolNetworkEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    let particles: Particle[] = [];
    const mouse = { x: -1e4, y: -1e4, radius: 150 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      particles = [];
      const n = Math.min(Math.floor((w * h) / 14000), 100);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const palette = [
          `rgba(14, 165, 233, ${Math.random() * 0.35 + 0.12})`,
          `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1})`,
          `rgba(236, 72, 153, ${Math.random() * 0.22 + 0.06})`,
        ];
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 1,
          density: Math.random() * 30 + 1,
          color: palette[Math.floor(Math.random() * palette.length)]!,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const loop = createLoop(reducedMotion, () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (mouse.x > -1e3) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * p.density * 0.5;
            p.y -= (dy / dist) * force * p.density * 0.5;
          }
        }
        p.x -= (p.x - p.baseX) / 20;
        p.y -= (p.y - p.baseY) / 20;
        p.baseX += p.vx * 0.1;
        p.baseY += p.vy * 0.1;
        if (p.baseX < 0) p.baseX = w;
        if (p.baseX > w) p.baseX = 0;
        if (p.baseY < 0) p.baseY = h;
        if (p.baseY > h) p.baseY = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.18 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      },
    };
  },
};

/** Jan 2026 (87da4b5): dual-layer cosmic starfield + network particles. */
export const cosmicStarfieldEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    type Star = {
      x: number;
      y: number;
      size: number;
      speed: number;
      twinkle: number;
      twinkleSpeed: number;
    };
    let stars: Star[] = [];
    let particles: Particle[] = [];
    const mouse = { x: -1e4, y: -1e4, radius: 150 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      stars = [];
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 0.4,
          speed: Math.random() * 0.3 + 0.08,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.025 + 0.01,
        });
      }
      particles = [];
      const n = Math.min(Math.floor((w * h) / 12000), 90);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 1,
          density: Math.random() * 30 + 1,
          color: [
            `rgba(14, 165, 233, ${Math.random() * 0.35 + 0.12})`,
            `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1})`,
            `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.06})`,
          ][Math.floor(Math.random() * 3)]!,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    // solid base once
    {
      const size = resizeCanvas(canvas);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.fillStyle = "#080a18";
      ctx.fillRect(0, 0, size.w, size.h);
    }

    const loop = createLoop(reducedMotion, () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(8, 10, 24, 0.45)";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const opacity = 0.25 + 0.75 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
        s.y += s.speed * 0.12;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
      }

      for (const p of particles) {
        if (mouse.x > -1e3) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * p.density * 0.5;
            p.y -= (dy / dist) * force * p.density * 0.5;
          }
        }
        p.x -= (p.x - p.baseX) / 20;
        p.y -= (p.y - p.baseY) / 20;
        p.baseX += p.vx * 0.1;
        p.baseY += p.vy * 0.1;
        if (p.baseX < 0) p.baseX = w;
        if (p.baseX > w) p.baseX = 0;
        if (p.baseY < 0) p.baseY = h;
        if (p.baseY > h) p.baseY = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      },
    };
  },
};

/** Jan 2026 (3f10111): Three.js Pantone-colored 3D drift — Canvas 2D port. */
export const pantoneDriftEngine: AnimationEngine = {
  mount: ({ canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();

    type P3 = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      r: number;
      g: number;
      b: number;
      size: number;
      phase: number;
    };

    const palette = [
      [164, 119, 100],
      [255, 190, 152],
      [187, 38, 73],
      [102, 103, 171],
      [59, 130, 246],
      [139, 92, 246],
      [6, 182, 212],
    ];

    let pts: P3[] = [];
    let mouse = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      const count = Math.min(1400, Math.floor((w * h) / 1200));
      pts = [];
      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)]!;
        pts.push({
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          z: (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.02,
          vz: (Math.random() - 0.5) * 0.02,
          r: c[0]!,
          g: c[1]!,
          b: c[2]!,
          size: Math.random() * 2.4 + 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);

    {
      const size = resizeCanvas(canvas);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.fillStyle = "#0c0a10";
      ctx.fillRect(0, 0, size.w, size.h);
    }

    let rotY = 0;
    let rotX = 0;

    const loop = createLoop(reducedMotion, (_dt, t) => {
      rotY = t * 0.05;
      rotX = Math.sin(t * 0.3) * 0.05;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(12, 10, 16, 0.32)";
      ctx.fillRect(0, 0, w, h);

      const projected: { sx: number; sy: number; depth: number; p: P3 }[] = [];

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy + Math.sin(t + p.phase) * 0.012;
        p.z += p.vz;

        const mdx = p.x - mouse.x * 30;
        const mdy = p.y - mouse.y * 30;
        const md = Math.hypot(mdx, mdy);
        if (md < 15) {
          const force = ((15 - md) / 15) * 0.08;
          p.x += mdx * force * 0.05;
          p.y += mdy * force * 0.05;
        }

        if (p.x > 50) p.x = -50;
        if (p.x < -50) p.x = 50;
        if (p.y > 50) p.y = -50;
        if (p.y < -50) p.y = 50;
        if (p.z > 25) p.z = -25;
        if (p.z < -25) p.z = 25;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        z1 = p.y * sinX + z1 * cosX;

        const fov = 280;
        const scale = fov / (fov + z1 + 40);
        const sx = w / 2 + x1 * scale * (Math.min(w, h) / 90);
        const sy = h / 2 + y1 * scale * (Math.min(w, h) / 90);
        projected.push({ sx, sy, depth: z1, p });
      }

      projected.sort((a, b) => a.depth - b.depth);

      for (const { sx, sy, depth, p } of projected) {
        const scale = 280 / (280 + depth + 40);
        const r = p.size * scale * 2.8;
        const alpha = clamp(0.4 + scale * 0.55, 0.2, 0.98);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
      },
    };
  },
};

function makeRingOverlay(container: HTMLElement, dual = false): HTMLElement {
  const root = document.createElement("div");
  root.className = dual ? "ag-rings ag-rings--dual" : "ag-rings";
  root.setAttribute("aria-hidden", "true");

  const primary = document.createElement("div");
  primary.className = "ag-rings__primary";
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("div");
    el.className = "ag-ring";
    primary.appendChild(el);
  }
  root.appendChild(primary);

  if (dual) {
    const secondary = document.createElement("div");
    secondary.className = "ag-rings__secondary";
    for (let i = 0; i < 8; i++) {
      const el = document.createElement("div");
      el.className = "ag-ring ag-ring--fast";
      secondary.appendChild(el);
    }
    root.appendChild(secondary);
  }

  container.appendChild(root);
  return root;
}

/** Jan 2026 (3eb6cdd): CSS Houdini Antigravity particle rings + soft field. */
export const antigravityRingsEngine: AnimationEngine = {
  mount: ({ container, canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();
    const overlay = makeRingOverlay(container, false);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: { x: number; y: number; s: number; tw: number; sp: number }[] = [];

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() * 1.2 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.008,
      }));
    };

    seed();
    window.addEventListener("resize", seed);

    const loop = createLoop(reducedMotion, () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.tw += s.sp;
        const o = 0.2 + 0.5 * Math.abs(Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${o})`;
        ctx.fill();
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        overlay.remove();
      },
    };
  },
};

/** Jan 2026 (295d930): dual-layer Agent Weightlessness rings + interactive particles. */
export const antigravityWeightlessEngine: AnimationEngine = {
  mount: ({ container, canvas, reducedMotion }) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return emptyHandle();
    const overlay = makeRingOverlay(container, true);

    let particles: Particle[] = [];
    const mouse = { x: -1e4, y: -1e4, radius: 180 };
    let w = 0;
    let h = 0;
    let dpr = 1;

    const seed = () => {
      const size = resizeCanvas(canvas);
      w = size.w;
      h = size.h;
      dpr = size.dpr;
      particles = [];
      const n = Math.min(Math.floor((w * h) / 11000), 110);
      for (let i = 0; i < n; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2.4 + 0.8,
          density: Math.random() * 32 + 2,
          color: [
            `rgba(96, 165, 250, ${Math.random() * 0.4 + 0.15})`,
            `rgba(167, 139, 250, ${Math.random() * 0.35 + 0.12})`,
            `rgba(244, 114, 182, ${Math.random() * 0.25 + 0.08})`,
          ][Math.floor(Math.random() * 3)]!,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };

    seed();
    window.addEventListener("resize", seed);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const loop = createLoop(reducedMotion, () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (mouse.x > -1e3) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * p.density * 0.12;
            p.y += (dy / dist) * force * p.density * 0.12;
          }
        }
        p.x -= (p.x - p.baseX) / 22;
        p.y -= (p.y - p.baseY) / 22;
        p.baseX += p.vx * 0.12;
        p.baseY += p.vy * 0.12;
        if (p.baseX < 0) p.baseX = w;
        if (p.baseX > w) p.baseX = 0;
        if (p.baseY < 0) p.baseY = h;
        if (p.baseY > h) p.baseY = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.14 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    });

    return {
      destroy: () => {
        loop.stop();
        window.removeEventListener("resize", seed);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
        overlay.remove();
      },
    };
  },
};

type HaloPt = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  scale: number;
  seed: number;
  life: number;
  heat: number;
};

function createHaloEngine(opts: {
  maxN: number;
  minN: number;
  densityDiv: number;
  colors: [number, number, number][];
}): AnimationEngine {
  return {
    mount: ({ canvas, reducedMotion }) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return emptyHandle();

      const noise = new SimplexNoise();
      const [C1, C2, C3] = opts.colors;
      const BUCKETS = 24;
      let hover = 0;
      let pulse = 1e9;
      const pointer = { x: -1e4, y: -1e4, over: false };
      let pts: HaloPt[] = [];
      let sprites: HTMLCanvasElement[] = [];
      let R = 0;
      let cx = 0;
      let cy = 0;
      let dpr = 1;
      let w = 0;
      let h = 0;

      const ramp = (p: number) => {
        const mid = 0.8;
        const [A, B] = p < mid ? [C1, C2] : [C2, C3];
        const t = p < mid ? p / mid : (p - mid) / (1 - mid);
        return A!.map((c, i) => Math.round(mix(c, B![i]!, t))) as [number, number, number];
      };

      const buildSprites = () => {
        sprites = [];
        const W = 22;
        const H = 9;
        for (let b = 0; b < BUCKETS; b++) {
          const s = document.createElement("canvas");
          s.width = W;
          s.height = H;
          const c = s.getContext("2d")!;
          const [r, g, bl] = ramp(b / (BUCKETS - 1));
          c.fillStyle = `rgb(${r},${g},${bl})`;
          c.beginPath();
          c.roundRect(1, 1, W - 2, H - 2, H / 2);
          c.fill();
          sprites.push(s);
        }
      };

      const density = (x: number, y: number) => {
        const d = Math.hypot(x - cx, y - cy);
        const j = noise.noise(x * 0.002, y * 0.002) * 0.005 * R;
        const w1 = 0.12 * R;
        const w2 = 0.05 * R;
        let t1 = smoothstep(R - 2 * w1, R, d) - smoothstep(R, R + w1, d + j);
        let t2 = smoothstep(R - 2 * w2, R, d) - smoothstep(R, R + w2, d + j);
        const t3 = smoothstep(R + w2, R, d) * 0.15;
        t1 = Math.max(0, t1) ** 2;
        t2 = Math.max(0, t2) ** 3 * 3;
        const field = Math.pow((noise.noise(x * 0.004, y * 0.004) + 1.5) * 0.5, 2) * 0.04;
        return t1 + t2 + t3 + field;
      };

      const seed = () => {
        const size = resizeCanvas(canvas, 2);
        w = size.w;
        h = size.h;
        dpr = size.dpr;
        R = Math.min(w, h) * 0.36;
        cx = w * 0.5;
        cy = h * 0.44;
        const N = Math.round(clamp((w * h) / opts.densityDiv, opts.minN, opts.maxN));
        pts = [];
        let guard = N * 400;
        while (pts.length < N && guard-- > 0) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          if (Math.random() < density(x, y) * 0.9) {
            pts.push({
              hx: x,
              hy: y,
              x,
              y,
              scale: 0,
              seed: Math.random(),
              life: 3 + (Math.random() * 2 - 1),
              heat: 0,
            });
          }
        }
      };

      buildSprites();
      seed();

      const onResize = () => seed();
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.over = e.clientY < innerHeight;
      };
      const onLeave = () => {
        pointer.over = false;
      };
      const onClick = () => {
        pulse = 0;
      };

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("click", onClick);

      const loop = createLoop(reducedMotion, (dt, t) => {
        const gatherR = 0.15 * Math.min(w, h);
        hover += ((pointer.over ? 1 : 0) - hover) * Math.min(1, dt / 0.4);
        if (pulse < 1) pulse += dt / 1.2;

        for (const p of pts) {
          const lt = (p.seed * 100 + t * 0.5) % p.life;
          let target = smoothstep(0.01, 0.5, lt) - smoothstep(0.5, 1, lt / p.life);
          const k = 1 / R;
          const dx =
            noise.n3(p.hx * k * 4, p.hy * k * 4, t * 0.35) * 0.03 * R +
            noise.n3(p.hx * k * 20, p.hy * k * 20, t * 0.5) * 0.005 * R +
            noise.n3(p.hx * k * 0.5, p.hy * k * 0.5, t * 0.15) * 0.025 * R;
          const dy =
            noise.n3(p.hx * k * 4 + 33, p.hy * k * 4 + 33, t * 0.35) * 0.03 * R +
            noise.n3(p.hx * k * 20 + 71, p.hy * k * 20 + 71, t * 0.5) * 0.005 * R +
            noise.n3(p.hx * k * 0.5 + 87, p.hy * k * 0.5 + 87, t * 0.15) * 0.025 * R;
          let tx = p.hx + dx;
          let ty = p.hy + dy;

          const pd = Math.hypot(pointer.x - p.x, pointer.y - p.y);
          const pull = smoothstep(gatherR, 0, pd) * hover;
          if (pull > 0.001) {
            tx = mix(tx, pointer.x, pull * 0.6);
            ty = mix(ty, pointer.y, pull * 0.6);
            target += pull * 1.5;
          }
          p.heat += (pull - p.heat) * 0.1;

          if (pulse < 1) {
            const dr = Math.hypot(p.hx - cx, p.hy - cy) / R;
            const wave =
              (smoothstep(pulse - 0.25, pulse, dr) - smoothstep(pulse, pulse + 0.25, dr)) *
              smoothstep(1, 0, dr) *
              0.02;
            tx = cx + (tx - cx) * (1 + wave);
            ty = cy + (ty - cy) * (1 + wave);
          }

          p.x += (tx - p.x) * 0.2;
          p.y += (ty - p.y) * 0.2;
          p.scale += (target - p.scale) * 0.1;
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of pts) {
          if (p.scale < 0.05) continue;
          let prog = smoothstep(
            0,
            0.75,
            ((noise.n3(p.hx * 0.008, p.hy * 0.008, t * 0.5) + 1) / 2) ** 2,
          );
          prog = Math.min(1, prog + p.heat);
          const spr = sprites[Math.round(prog * (BUCKETS - 1))]!;
          const ang =
            Math.atan2(p.y - cy, p.x - cx) +
            noise.n3(p.hx * 0.02, p.hy * 0.02, t * 0.85) * 0.5;
          const s = (p.scale * 7 * dpr * 0.5 + 0.5) / 9;
          ctx.setTransform(
            Math.cos(ang) * s,
            Math.sin(ang) * s,
            -Math.sin(ang) * s,
            Math.cos(ang) * s,
            p.x * dpr,
            p.y * dpr,
          );
          ctx.globalAlpha = Math.min(1, p.scale) * 0.9;
          ctx.drawImage(spr, -11, -4.5);
        }
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      return {
        destroy: () => {
          loop.stop();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("click", onClick);
        },
      };
    },
  };
}

/** Jul 2026 v2 Aurora-Prime: denser Halo (Protocol v19 canvas tier). */
export const auroraPrimeEngine = createHaloEngine({
  maxN: 9000,
  minN: 3200,
  densityDiv: 220,
  colors: [
    [0, 113, 227],
    [191, 90, 242],
    [255, 55, 95],
  ],
});

/** Jul 2026 v3 Aurora-Zenith: lighter Halo (Protocol v18, current site). */
export const auroraZenithEngine = createHaloEngine({
  maxN: 6000,
  minN: 2200,
  densityDiv: 300,
  colors: [
    [0, 113, 227],
    [191, 90, 242],
    [255, 55, 95],
  ],
});
