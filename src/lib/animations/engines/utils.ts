export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  dprCap = 2,
): { w: number; h: number; dpr: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  return { w, h, dpr };
}

/** 2D Simplex noise — port of the Halo engine noise from 000.github.io */
export class SimplexNoise {
  p: Uint8Array;
  perm: Uint8Array;

  constructor() {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = Math.floor(256 * Math.random());
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255]!;
  }

  private dot(gx: number, gy: number, x: number, y: number) {
    return gx * x + gy * y;
  }

  noise(xin: number, yin: number) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const i = Math.floor(xin + (xin + yin) * F2);
    const j = Math.floor(yin + (xin + yin) * F2);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    let i1: number, j1: number;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]!]! % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]!]! % 12;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]!]! % 12;
    const t0 = 0.5 - x0 * x0 - y0 * y0;
    const n0 =
      t0 < 0 ? 0 : Math.pow(t0, 4) * this.dot(Math.cos(gi0), Math.sin(gi0), x0, y0);
    const t1 = 0.5 - x1 * x1 - y1 * y1;
    const n1 =
      t1 < 0 ? 0 : Math.pow(t1, 4) * this.dot(Math.cos(gi1), Math.sin(gi1), x1, y1);
    const t2 = 0.5 - x2 * x2 - y2 * y2;
    const n2 =
      t2 < 0 ? 0 : Math.pow(t2, 4) * this.dot(Math.cos(gi2), Math.sin(gi2), x2, y2);
    return 70 * (n0 + n1 + n2);
  }

  n3(x: number, y: number, z: number) {
    return this.noise(x + z * 0.7, y - z * 0.7);
  }
}

export type LoopController = {
  stop: () => void;
};

export function createLoop(
  reducedMotion: boolean,
  step: (dt: number, t: number) => void,
): LoopController {
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let alive = true;

  const tick = (now: number) => {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!document.hidden) {
      t += dt;
      step(dt, t);
    }
    raf = requestAnimationFrame(tick);
  };

  if (reducedMotion) {
    step(1 / 60, 0);
  } else {
    raf = requestAnimationFrame(tick);
  }

  return {
    stop: () => {
      alive = false;
      cancelAnimationFrame(raf);
    },
  };
}
