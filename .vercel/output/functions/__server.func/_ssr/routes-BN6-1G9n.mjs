import { o as __toESM } from "../_runtime.mjs";
import { N as require_react, g as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ExternalLink, i as Pause, n as Sparkles, o as ChevronRight, r as Play, s as ChevronLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BN6-1G9n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function mix(a, b, t) {
	return a + (b - a) * t;
}
function smoothstep(e0, e1, x) {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
}
function resizeCanvas(canvas, dprCap = 2) {
	const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
	const w = window.innerWidth;
	const h = window.innerHeight;
	canvas.width = Math.floor(w * dpr);
	canvas.height = Math.floor(h * dpr);
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
	return {
		w,
		h,
		dpr
	};
}
/** 2D Simplex noise — port of the Halo engine noise from 000.github.io */
var SimplexNoise = class {
	p;
	perm;
	constructor() {
		this.p = /* @__PURE__ */ new Uint8Array(256);
		for (let i = 0; i < 256; i++) this.p[i] = Math.floor(256 * Math.random());
		this.perm = /* @__PURE__ */ new Uint8Array(512);
		for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
	}
	dot(gx, gy, x, y) {
		return gx * x + gy * y;
	}
	noise(xin, yin) {
		const F2 = .5 * (Math.sqrt(3) - 1);
		const G2 = (3 - Math.sqrt(3)) / 6;
		const i = Math.floor(xin + (xin + yin) * F2);
		const j = Math.floor(yin + (xin + yin) * F2);
		const t = (i + j) * G2;
		const X0 = i - t;
		const Y0 = j - t;
		const x0 = xin - X0;
		const y0 = yin - Y0;
		let i1, j1;
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
		const gi0 = this.perm[ii + this.perm[jj]] % 12;
		const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
		const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
		const t0 = .5 - x0 * x0 - y0 * y0;
		const n0 = t0 < 0 ? 0 : Math.pow(t0, 4) * this.dot(Math.cos(gi0), Math.sin(gi0), x0, y0);
		const t1 = .5 - x1 * x1 - y1 * y1;
		const n1 = t1 < 0 ? 0 : Math.pow(t1, 4) * this.dot(Math.cos(gi1), Math.sin(gi1), x1, y1);
		const t2 = .5 - x2 * x2 - y2 * y2;
		const n2 = t2 < 0 ? 0 : Math.pow(t2, 4) * this.dot(Math.cos(gi2), Math.sin(gi2), x2, y2);
		return 70 * (n0 + n1 + n2);
	}
	n3(x, y, z) {
		return this.noise(x + z * .7, y - z * .7);
	}
};
function createLoop(reducedMotion, step) {
	let raf = 0;
	let last = performance.now();
	let t = 0;
	let alive = true;
	const tick = (now) => {
		if (!alive) return;
		const dt = Math.min(.05, (now - last) / 1e3);
		last = now;
		if (!document.hidden) {
			t += dt;
			step(dt, t);
		}
		raf = requestAnimationFrame(tick);
	};
	if (reducedMotion) step(1 / 60, 0);
	else raf = requestAnimationFrame(tick);
	return { stop: () => {
		alive = false;
		cancelAnimationFrame(raf);
	} };
}
function emptyHandle() {
	return { destroy: () => {} };
}
/** 2018–early 2025: plain static surface, no motion. */
var staticEngine = { mount: ({ canvas, reducedMotion }) => {
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
		for (let i = 0; i < 400; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
	};
	paint();
	const onResize = () => paint();
	window.addEventListener("resize", onResize);
	return { destroy: () => window.removeEventListener("resize", onResize) };
} };
/** Aug 2025 (503c86e): mouse-repulsion blue particle field. */
var blueFieldEngine = { mount: ({ canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	let particles = [];
	const mouse = {
		x: -1e4,
		y: -1e4,
		radius: 150
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		particles = [];
		const n = Math.min(Math.floor(w * h / 15e3), 120);
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
				color: `rgba(37, 99, 235, ${Math.random() * .35 + .12})`,
				vx: 0,
				vy: 0
			});
		}
	};
	const onMove = (e) => {
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
		meshPhase += dt * .03;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		ctx.save();
		ctx.translate(w / 2, h / 2);
		ctx.rotate(meshPhase);
		ctx.translate(-w / 2, -h / 2);
		const orbs = [
			{
				x: w * .2,
				y: h * .8,
				c: "rgba(37,99,235,0.08)"
			},
			{
				x: w * .8,
				y: h * .2,
				c: "rgba(139,92,246,0.07)"
			},
			{
				x: w * .4,
				y: h * .4,
				c: "rgba(14,165,233,0.06)"
			}
		];
		for (const o of orbs) {
			const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, Math.max(w, h) * .35);
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
				p.x -= dx / dist * force * p.density;
				p.y -= dy / dist * force * p.density;
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
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerleave", onLeave);
	} };
} };
/** Nov 2025 (9f728eb): denser multi-color elite cyber particles. */
var eliteCyberEngine = { mount: ({ canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	let particles = [];
	const mouse = {
		x: -1e4,
		y: -1e4,
		radius: 160
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const colors = () => [
		`rgba(14, 165, 233, ${Math.random() * .4 + .15})`,
		`rgba(139, 92, 246, ${Math.random() * .4 + .12})`,
		`rgba(236, 72, 153, ${Math.random() * .3 + .08})`,
		`rgba(34, 211, 238, ${Math.random() * .35 + .1})`
	];
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		particles = [];
		const n = Math.min(Math.floor(w * h / 1e4), 160);
		for (let i = 0; i < n; i++) {
			const x = Math.random() * w;
			const y = Math.random() * h;
			const c = colors();
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				size: Math.random() * 2.2 + .8,
				density: Math.random() * 28 + 2,
				color: c[Math.floor(Math.random() * c.length)],
				vx: (Math.random() - .5) * .4,
				vy: (Math.random() - .5) * .4
			});
		}
	};
	const onMove = (e) => {
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
			p.baseX += p.vx * .15;
			p.baseY += p.vy * .15;
			if (p.baseX < 0) p.baseX = w;
			if (p.baseX > w) p.baseX = 0;
			if (p.baseY < 0) p.baseY = h;
			if (p.baseY > h) p.baseY = 0;
			const dx = mouse.x - p.x;
			const dy = mouse.y - p.y;
			const dist = Math.hypot(dx, dy) || 1;
			if (dist < mouse.radius) {
				const force = (mouse.radius - dist) / mouse.radius;
				p.x -= dx / dist * force * p.density * .55;
				p.y -= dy / dist * force * p.density * .55;
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
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerleave", onLeave);
	} };
} };
/** Nov 2025 / Jan 2026: particles with connection graph (protocol network). */
var protocolNetworkEngine = { mount: ({ canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	let particles = [];
	const mouse = {
		x: -1e4,
		y: -1e4,
		radius: 150
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		particles = [];
		const n = Math.min(Math.floor(w * h / 14e3), 100);
		for (let i = 0; i < n; i++) {
			const x = Math.random() * w;
			const y = Math.random() * h;
			const palette = [
				`rgba(14, 165, 233, ${Math.random() * .35 + .12})`,
				`rgba(139, 92, 246, ${Math.random() * .3 + .1})`,
				`rgba(236, 72, 153, ${Math.random() * .22 + .06})`
			];
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				size: Math.random() * 2 + 1,
				density: Math.random() * 30 + 1,
				color: palette[Math.floor(Math.random() * palette.length)],
				vx: (Math.random() - .5) * .5,
				vy: (Math.random() - .5) * .5
			});
		}
	};
	const onMove = (e) => {
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
					p.x -= dx / dist * force * p.density * .5;
					p.y -= dy / dist * force * p.density * .5;
				}
			}
			p.x -= (p.x - p.baseX) / 20;
			p.y -= (p.y - p.baseY) / 20;
			p.baseX += p.vx * .1;
			p.baseY += p.vy * .1;
			if (p.baseX < 0) p.baseX = w;
			if (p.baseX > w) p.baseX = 0;
			if (p.baseY < 0) p.baseY = h;
			if (p.baseY > h) p.baseY = 0;
		}
		for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
			const a = particles[i];
			const b = particles[j];
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			if (dist < 120) {
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.strokeStyle = `rgba(59, 130, 246, ${.18 * (1 - dist / 120)})`;
				ctx.lineWidth = .6;
				ctx.stroke();
			}
		}
		for (const p of particles) {
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
	});
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerleave", onLeave);
	} };
} };
/** Jan 2026 (87da4b5): dual-layer cosmic starfield + network particles. */
var cosmicStarfieldEngine = { mount: ({ canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	let stars = [];
	let particles = [];
	const mouse = {
		x: -1e4,
		y: -1e4,
		radius: 150
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		stars = [];
		for (let i = 0; i < 180; i++) stars.push({
			x: Math.random() * w,
			y: Math.random() * h,
			size: Math.random() * 1.5 + .4,
			speed: Math.random() * .3 + .08,
			twinkle: Math.random() * Math.PI * 2,
			twinkleSpeed: Math.random() * .025 + .01
		});
		particles = [];
		const n = Math.min(Math.floor(w * h / 12e3), 90);
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
					`rgba(14, 165, 233, ${Math.random() * .35 + .12})`,
					`rgba(139, 92, 246, ${Math.random() * .3 + .1})`,
					`rgba(236, 72, 153, ${Math.random() * .2 + .06})`
				][Math.floor(Math.random() * 3)],
				vx: (Math.random() - .5) * .45,
				vy: (Math.random() - .5) * .45
			});
		}
	};
	const onMove = (e) => {
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
		ctx.fillStyle = "rgba(8, 10, 24, 0.35)";
		ctx.fillRect(0, 0, w, h);
		ctx.globalCompositeOperation = "source-over";
		for (const s of stars) {
			s.twinkle += s.twinkleSpeed;
			const opacity = .25 + .75 * Math.abs(Math.sin(s.twinkle));
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255,255,255,${opacity})`;
			ctx.fill();
			s.y += s.speed * .12;
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
					p.x -= dx / dist * force * p.density * .5;
					p.y -= dy / dist * force * p.density * .5;
				}
			}
			p.x -= (p.x - p.baseX) / 20;
			p.y -= (p.y - p.baseY) / 20;
			p.baseX += p.vx * .1;
			p.baseY += p.vy * .1;
			if (p.baseX < 0) p.baseX = w;
			if (p.baseX > w) p.baseX = 0;
			if (p.baseY < 0) p.baseY = h;
			if (p.baseY > h) p.baseY = 0;
		}
		for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
			const a = particles[i];
			const b = particles[j];
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			if (dist < 120) {
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.strokeStyle = `rgba(96, 165, 250, ${.2 * (1 - dist / 120)})`;
				ctx.lineWidth = .55;
				ctx.stroke();
			}
		}
		for (const p of particles) {
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
	});
	const size = resizeCanvas(canvas);
	ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
	ctx.fillStyle = "#080a18";
	ctx.fillRect(0, 0, size.w, size.h);
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerleave", onLeave);
	} };
} };
/** Jan 2026 (3f10111): Three.js Pantone-colored 3D drift — Canvas 2D port. */
var pantoneDriftEngine = { mount: ({ canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	const palette = [
		[
			164,
			119,
			100
		],
		[
			255,
			190,
			152
		],
		[
			187,
			38,
			73
		],
		[
			102,
			103,
			171
		],
		[
			59,
			130,
			246
		],
		[
			139,
			92,
			246
		],
		[
			6,
			182,
			212
		]
	];
	let pts = [];
	let mouse = {
		x: 0,
		y: 0
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		const count = Math.min(900, Math.floor(w * h / 1800));
		pts = [];
		for (let i = 0; i < count; i++) {
			const c = palette[Math.floor(Math.random() * palette.length)];
			pts.push({
				x: (Math.random() - .5) * 100,
				y: (Math.random() - .5) * 100,
				z: (Math.random() - .5) * 50,
				vx: (Math.random() - .5) * .02,
				vy: (Math.random() - .5) * .02,
				vz: (Math.random() - .5) * .02,
				r: c[0],
				g: c[1],
				b: c[2],
				size: Math.random() * 2 + .5,
				phase: Math.random() * Math.PI * 2
			});
		}
	};
	const onMove = (e) => {
		mouse.x = e.clientX / window.innerWidth * 2 - 1;
		mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	};
	seed();
	window.addEventListener("resize", seed);
	window.addEventListener("pointermove", onMove);
	let rotY = 0;
	let rotX = 0;
	const loop = createLoop(reducedMotion, (dt, t) => {
		rotY = t * .05;
		rotX = Math.sin(t * .3) * .05;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.fillStyle = "rgba(12, 10, 16, 0.28)";
		ctx.fillRect(0, 0, w, h);
		const projected = [];
		for (const p of pts) {
			p.x += p.vx;
			p.y += p.vy + Math.sin(t + p.phase) * .012;
			p.z += p.vz;
			const mdx = p.x - mouse.x * 30;
			const mdy = p.y - mouse.y * 30;
			const md = Math.hypot(mdx, mdy);
			if (md < 15) {
				const force = (15 - md) / 15 * .08;
				p.x += mdx * force * .05;
				p.y += mdy * force * .05;
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
			let y1 = p.y * cosX - z1 * sinX;
			z1 = p.y * sinX + z1 * cosX;
			const fov = 280;
			const scale = fov / (fov + z1 + 40);
			const sx = w / 2 + x1 * scale * (Math.min(w, h) / 90);
			const sy = h / 2 + y1 * scale * (Math.min(w, h) / 90);
			projected.push({
				sx,
				sy,
				depth: z1,
				p
			});
		}
		projected.sort((a, b) => a.depth - b.depth);
		for (const { sx, sy, depth, p } of projected) {
			const scale = 280 / (280 + depth + 40);
			const r = p.size * scale * 2.2;
			const alpha = clamp(.35 + scale * .5, .15, .95);
			ctx.beginPath();
			ctx.arc(sx, sy, r, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
			ctx.fill();
		}
	});
	{
		const size = resizeCanvas(canvas);
		ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
		ctx.fillStyle = "#0c0a10";
		ctx.fillRect(0, 0, size.w, size.h);
	}
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
	} };
} };
function makeRingOverlay(container, dual = false) {
	const root = document.createElement("div");
	root.className = dual ? "ag-rings ag-rings--dual" : "ag-rings";
	root.setAttribute("aria-hidden", "true");
	const primary = document.createElement("div");
	primary.className = "ag-rings__primary";
	for (let i = 0; i < 16; i++) {
		const el = document.createElement("div");
		el.className = "ag-ring";
		el.style.setProperty("--i", String(i));
		primary.appendChild(el);
	}
	root.appendChild(primary);
	if (dual) {
		const secondary = document.createElement("div");
		secondary.className = "ag-rings__secondary";
		for (let i = 0; i < 8; i++) {
			const el = document.createElement("div");
			el.className = "ag-ring ag-ring--fast";
			el.style.setProperty("--i", String(i));
			secondary.appendChild(el);
		}
		root.appendChild(secondary);
	}
	container.appendChild(root);
	return root;
}
/** Jan 2026 (3eb6cdd): CSS Houdini Antigravity particle rings + soft field. */
var antigravityRingsEngine = { mount: ({ container, canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	const overlay = makeRingOverlay(container, false);
	let w = 0;
	let h = 0;
	let dpr = 1;
	let stars = [];
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		stars = Array.from({ length: 80 }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			s: Math.random() * 1.2 + .3,
			tw: Math.random() * Math.PI * 2,
			sp: Math.random() * .02 + .008
		}));
	};
	seed();
	window.addEventListener("resize", seed);
	const loop = createLoop(reducedMotion, () => {
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);
		for (const s of stars) {
			s.tw += s.sp;
			const o = .2 + .5 * Math.abs(Math.sin(s.tw));
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255,255,255,${o})`;
			ctx.fill();
		}
	});
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		overlay.remove();
	} };
} };
/** Jan 2026 (295d930): dual-layer Agent Weightlessness rings + interactive particles. */
var antigravityWeightlessEngine = { mount: ({ container, canvas, reducedMotion }) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return emptyHandle();
	const overlay = makeRingOverlay(container, true);
	let particles = [];
	const mouse = {
		x: -1e4,
		y: -1e4,
		radius: 180
	};
	let w = 0;
	let h = 0;
	let dpr = 1;
	const seed = () => {
		const size = resizeCanvas(canvas);
		w = size.w;
		h = size.h;
		dpr = size.dpr;
		particles = [];
		const n = Math.min(Math.floor(w * h / 11e3), 110);
		for (let i = 0; i < n; i++) {
			const x = Math.random() * w;
			const y = Math.random() * h;
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				size: Math.random() * 2.4 + .8,
				density: Math.random() * 32 + 2,
				color: [
					`rgba(96, 165, 250, ${Math.random() * .4 + .15})`,
					`rgba(167, 139, 250, ${Math.random() * .35 + .12})`,
					`rgba(244, 114, 182, ${Math.random() * .25 + .08})`
				][Math.floor(Math.random() * 3)],
				vx: (Math.random() - .5) * .55,
				vy: (Math.random() - .5) * .55
			});
		}
	};
	const onMove = (e) => {
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
					p.x += dx / dist * force * p.density * .12;
					p.y += dy / dist * force * p.density * .12;
				}
			}
			p.x -= (p.x - p.baseX) / 22;
			p.y -= (p.y - p.baseY) / 22;
			p.baseX += p.vx * .12;
			p.baseY += p.vy * .12;
			if (p.baseX < 0) p.baseX = w;
			if (p.baseX > w) p.baseX = 0;
			if (p.baseY < 0) p.baseY = h;
			if (p.baseY > h) p.baseY = 0;
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
		for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
			const a = particles[i];
			const b = particles[j];
			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			if (dist < 100) {
				ctx.beginPath();
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.strokeStyle = `rgba(147, 197, 253, ${.14 * (1 - dist / 100)})`;
				ctx.lineWidth = .5;
				ctx.stroke();
			}
		}
	});
	return { destroy: () => {
		loop.stop();
		window.removeEventListener("resize", seed);
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerleave", onLeave);
		overlay.remove();
	} };
} };
function createHaloEngine(opts) {
	return { mount: ({ canvas, reducedMotion }) => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return emptyHandle();
		const noise = new SimplexNoise();
		const [C1, C2, C3] = opts.colors;
		const BUCKETS = 24;
		let hover = 0;
		let pulse = 1e9;
		const pointer = {
			x: -1e4,
			y: -1e4,
			over: false
		};
		let pts = [];
		let sprites = [];
		let R = 0;
		let cx = 0;
		let cy = 0;
		let dpr = 1;
		let w = 0;
		let h = 0;
		const ramp = (p) => {
			const mid = .8;
			const [A, B] = p < mid ? [C1, C2] : [C2, C3];
			const t = p < mid ? p / mid : (p - mid) / .19999999999999996;
			return A.map((c, i) => Math.round(mix(c, B[i], t)));
		};
		const buildSprites = () => {
			sprites = [];
			const W = 22;
			const H = 9;
			for (let b = 0; b < BUCKETS; b++) {
				const s = document.createElement("canvas");
				s.width = W;
				s.height = H;
				const c = s.getContext("2d");
				const [r, g, bl] = ramp(b / 23);
				c.fillStyle = `rgb(${r},${g},${bl})`;
				c.beginPath();
				c.roundRect(1, 1, 20, 7, H / 2);
				c.fill();
				sprites.push(s);
			}
		};
		const density = (x, y) => {
			const d = Math.hypot(x - cx, y - cy);
			const j = noise.noise(x * .002, y * .002) * .005 * R;
			const w1 = .12 * R;
			const w2 = .05 * R;
			let t1 = smoothstep(R - 2 * w1, R, d) - smoothstep(R, R + w1, d + j);
			let t2 = smoothstep(R - 2 * w2, R, d) - smoothstep(R, R + w2, d + j);
			const t3 = smoothstep(R + w2, R, d) * .15;
			t1 = Math.max(0, t1) ** 2;
			t2 = Math.max(0, t2) ** 3 * 3;
			const field = Math.pow((noise.noise(x * .004, y * .004) + 1.5) * .5, 2) * .04;
			return t1 + t2 + t3 + field;
		};
		const seed = () => {
			const size = resizeCanvas(canvas, 2);
			w = size.w;
			h = size.h;
			dpr = size.dpr;
			R = Math.min(w, h) * .36;
			cx = w * .5;
			cy = h * .44;
			const N = Math.round(clamp(w * h / opts.densityDiv, opts.minN, opts.maxN));
			pts = [];
			let guard = N * 400;
			while (pts.length < N && guard-- > 0) {
				const x = Math.random() * w;
				const y = Math.random() * h;
				if (Math.random() < density(x, y) * .9) pts.push({
					hx: x,
					hy: y,
					x,
					y,
					scale: 0,
					seed: Math.random(),
					life: 3 + (Math.random() * 2 - 1),
					heat: 0
				});
			}
		};
		buildSprites();
		seed();
		const onResize = () => seed();
		const onMove = (e) => {
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
			const gatherR = .15 * Math.min(w, h);
			hover += ((pointer.over ? 1 : 0) - hover) * Math.min(1, dt / .4);
			if (pulse < 1) pulse += dt / 1.2;
			for (const p of pts) {
				const lt = (p.seed * 100 + t * .5) % p.life;
				let target = smoothstep(.01, .5, lt) - smoothstep(.5, 1, lt / p.life);
				const k = 1 / R;
				let dx = noise.n3(p.hx * k * 4, p.hy * k * 4, t * .35) * .03 * R + noise.n3(p.hx * k * 20, p.hy * k * 20, t * .5) * .005 * R + noise.n3(p.hx * k * .5, p.hy * k * .5, t * .15) * .025 * R;
				let dy = noise.n3(p.hx * k * 4 + 33, p.hy * k * 4 + 33, t * .35) * .03 * R + noise.n3(p.hx * k * 20 + 71, p.hy * k * 20 + 71, t * .5) * .005 * R + noise.n3(p.hx * k * .5 + 87, p.hy * k * .5 + 87, t * .15) * .025 * R;
				let tx = p.hx + dx;
				let ty = p.hy + dy;
				const pull = smoothstep(gatherR, 0, Math.hypot(pointer.x - p.x, pointer.y - p.y)) * hover;
				if (pull > .001) {
					tx = mix(tx, pointer.x, pull * .6);
					ty = mix(ty, pointer.y, pull * .6);
					target += pull * 1.5;
				}
				p.heat += (pull - p.heat) * .1;
				if (pulse < 1) {
					const dr = Math.hypot(p.hx - cx, p.hy - cy) / R;
					const wave = (smoothstep(pulse - .25, pulse, dr) - smoothstep(pulse, pulse + .25, dr)) * smoothstep(1, 0, dr) * .02;
					tx = cx + (tx - cx) * (1 + wave);
					ty = cy + (ty - cy) * (1 + wave);
				}
				p.x += (tx - p.x) * .2;
				p.y += (ty - p.y) * .2;
				p.scale += (target - p.scale) * .1;
			}
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const p of pts) {
				if (p.scale < .05) continue;
				let prog = smoothstep(0, .75, ((noise.n3(p.hx * .008, p.hy * .008, t * .5) + 1) / 2) ** 2);
				prog = Math.min(1, prog + p.heat);
				const spr = sprites[Math.round(prog * 23)];
				const ang = Math.atan2(p.y - cy, p.x - cx) + noise.n3(p.hx * .02, p.hy * .02, t * .85) * .5;
				const s = (p.scale * 7 * dpr * .5 + .5) / 9;
				ctx.setTransform(Math.cos(ang) * s, Math.sin(ang) * s, -Math.sin(ang) * s, Math.cos(ang) * s, p.x * dpr, p.y * dpr);
				ctx.globalAlpha = Math.min(1, p.scale) * .9;
				ctx.drawImage(spr, -11, -4.5);
			}
			ctx.globalAlpha = 1;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		});
		return { destroy: () => {
			loop.stop();
			window.removeEventListener("resize", onResize);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerleave", onLeave);
			window.removeEventListener("click", onClick);
		} };
	} };
}
/** Jul 2026 v2 Aurora-Prime: denser Halo (Protocol v19 canvas tier). */
var auroraPrimeEngine = createHaloEngine({
	maxN: 9e3,
	minN: 3200,
	densityDiv: 220,
	colors: [
		[
			0,
			113,
			227
		],
		[
			191,
			90,
			242
		],
		[
			255,
			55,
			95
		]
	]
});
/** Jul 2026 v3 Aurora-Zenith: lighter Halo (Protocol v18, current site). */
var auroraZenithEngine = createHaloEngine({
	maxN: 6e3,
	minN: 2200,
	densityDiv: 300,
	colors: [
		[
			0,
			113,
			227
		],
		[
			191,
			90,
			242
		],
		[
			255,
			55,
			95
		]
	]
});
/**
* Background animation lineage of https://github.com/000/000.github.io
* (index.html across commit history), ordered chronologically.
*/
var ANIMATION_MODES = [
	{
		id: "static",
		name: "Static Canvas",
		shortName: "Static",
		era: "2018 – early 2025",
		date: "2018-02 → 2025-02",
		commit: "5f72ec6 … 97e0c98",
		versionLabel: "Pre-motion",
		description: "The earliest GitHub Pages eras: plain surface, no particle system. A calm baseline before motion entered the profile.",
		surface: "light",
		engine: staticEngine
	},
	{
		id: "blue-field",
		name: "Interactive Blue Field",
		shortName: "Blue Field",
		era: "Aug 2025",
		date: "2025-08-14",
		commit: "503c86e",
		versionLabel: "v1 Particles",
		description: "First canvas particle system with mouse repulsion and a slow-rotating gradient mesh — the birth of the animated background.",
		surface: "light",
		engine: blueFieldEngine
	},
	{
		id: "elite-cyber",
		name: "Elite Cyber Particles",
		shortName: "Elite Cyber",
		era: "Nov 2025",
		date: "2025-11-05",
		commit: "9f728eb",
		versionLabel: "Elite",
		description: "Denser multi-hue cyber palette (cyan / violet / pink), subtle drift, and a faint grid haze over the field.",
		surface: "cyber",
		engine: eliteCyberEngine
	},
	{
		id: "protocol-network",
		name: "Protocol Link Network",
		shortName: "Link Network",
		era: "Nov 2025",
		date: "2025-11-26",
		commit: "923c3f6",
		versionLabel: "Protocol",
		description: "Configurable particle count with proximity edge-links — the network-graph look that carried into the cosmic era.",
		surface: "cyber",
		engine: protocolNetworkEngine
	},
	{
		id: "cosmic-starfield",
		name: "Cosmic Starfield",
		shortName: "Starfield",
		era: "Jan 2026",
		date: "2026-01-04",
		commit: "87da4b5",
		versionLabel: "Cosmic Dual",
		description: "Dual-layer system: twinkling starfield canvas plus interactive networked particles on a deep void.",
		surface: "void",
		engine: cosmicStarfieldEngine
	},
	{
		id: "pantone-drift",
		name: "Pantone 3D Drift",
		shortName: "Pantone 3D",
		era: "Jan 2026",
		date: "2026-01-16",
		commit: "3f10111",
		versionLabel: "Three.js",
		description: "Three.js antigravity particle cloud using Pantone Colors of the Year (Mocha Mousse, Peach Fuzz, Viva Magenta, Very Peri).",
		surface: "dark",
		engine: pantoneDriftEngine
	},
	{
		id: "antigravity-rings",
		name: "Antigravity Rings",
		shortName: "AG Rings",
		era: "Jan 2026",
		date: "2026-01-16",
		commit: "3eb6cdd",
		versionLabel: "Houdini Motion",
		description: "CSS Houdini @property particle rings with breathing radius — the first Antigravity Motion System layer.",
		surface: "void",
		engine: antigravityRingsEngine
	},
	{
		id: "antigravity-weightless",
		name: "Agentic Weightlessness",
		shortName: "Weightless",
		era: "Jan 2026",
		date: "2026-01-23",
		commit: "295d930 / d661a03",
		versionLabel: "Antigravity+",
		description: "Dual-layer floating rings plus interactive gather particles — inspired by antigravity.google, light/dark aware.",
		surface: "void",
		engine: antigravityWeightlessEngine
	},
	{
		id: "aurora-prime",
		name: "Aurora-Prime Halo",
		shortName: "Aurora-Prime",
		era: "Jul 2026",
		date: "2026-07-08",
		commit: "431b741",
		versionLabel: "Profile v2 · Protocol v19",
		description: "Dual-tier Antigravity Halo (dense Canvas 2D tier): spectrum grain ring, pointer gather, click shockwave. Porcelain glass era.",
		surface: "light",
		engine: auroraPrimeEngine
	},
	{
		id: "aurora-zenith",
		name: "Aurora-Zenith Halo",
		shortName: "Aurora-Zenith",
		era: "Jul 2026 · current",
		date: "2026-07-08",
		commit: "b855740",
		versionLabel: "Profile v3 · Protocol v18",
		description: "Current defense.engineer / 000.github.io engine: lighter Canvas 2D Halo (N clamp 2200–6000), dependency-free, attempt-capped seed.",
		surface: "light",
		engine: auroraZenithEngine
	}
];
function modeIndex(id) {
	const i = ANIMATION_MODES.findIndex((m) => m.id === id);
	return i < 0 ? 0 : i;
}
function nextModeId(id) {
	return ANIMATION_MODES[(modeIndex(id) + 1) % ANIMATION_MODES.length].id;
}
function prevModeId(id) {
	return ANIMATION_MODES[(modeIndex(id) - 1 + ANIMATION_MODES.length) % ANIMATION_MODES.length].id;
}
function AnimationPicker({ mode, index, autoCycle, onSelect, onPrev, onNext, onToggleAuto }) {
	const total = ANIMATION_MODES.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "picker",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "picker__header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "picker__kicker",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-3.5 opacity-70",
							strokeWidth: 1.75
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Background lineage" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "picker__count",
							children: [
								index + 1,
								" / ",
								total
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://github.com/000/000.github.io/blob/master/index.html",
					target: "_blank",
					rel: "noreferrer",
					className: "picker__source",
					children: ["Source history", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
						className: "size-3",
						strokeWidth: 1.75
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "picker__title-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "picker__nav",
						onClick: onPrev,
						"aria-label": "Previous animation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "picker__title-block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "picker__name",
							children: mode.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "picker__meta",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "picker__badge",
									children: mode.versionLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "picker__sep" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mode.era })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "picker__nav",
						onClick: onNext,
						"aria-label": "Next animation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-5",
							strokeWidth: 1.75
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "picker__desc",
				children: mode.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "picker__commit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "picker__commit-label",
						children: "Commit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: mode.commit }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "picker__sep" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mode.date })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "picker__dots",
				role: "tablist",
				"aria-label": "Select animation",
				children: ANIMATION_MODES.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					"aria-selected": m.id === mode.id,
					"aria-label": m.name,
					title: m.shortName,
					className: `picker__dot ${m.id === mode.id ? "is-active" : ""}`,
					onClick: () => onSelect(m.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: m.shortName
					}), i + 1]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "picker__controls",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "picker__switch",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "picker__switch-label",
						children: "Auto-cycle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "switch",
						"aria-checked": autoCycle,
						className: `switch ${autoCycle ? "is-on" : ""}`,
						onClick: onToggleAuto,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "switch__thumb" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "picker__cycle-btn",
					onClick: onNext,
					children: autoCycle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), "Cycling every 12s"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), "Next animation"] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "picker__list",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "picker__select-label",
					htmlFor: "anim-select",
					children: "Jump to era"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "anim-select",
					className: "picker__select",
					value: mode.id,
					onChange: (e) => onSelect(e.target.value),
					children: ANIMATION_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: m.id,
						children: [
							m.shortName,
							" — ",
							m.versionLabel
						]
					}, m.id))
				})]
			})
		]
	});
}
function BackgroundStage({ mode }) {
	const containerRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const handle = mode.engine.mount({
			container,
			canvas,
			reducedMotion
		});
		return () => {
			handle.destroy();
			for (const child of Array.from(container.children)) if (child !== canvas) child.remove();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		};
	}, [mode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: `bg-stage bg-stage--${mode.surface}`,
		"data-mode": mode.id,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-stage__bloom" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "bg-stage__canvas"
		})]
	});
}
var STORAGE_KEY = "bg-sampler-mode";
var AUTO_KEY = "bg-sampler-auto";
var CYCLE_MS = 12e3;
function Home() {
	const [modeId, setModeId] = (0, import_react.useState)(ANIMATION_MODES[ANIMATION_MODES.length - 1].id);
	const [autoCycle, setAutoCycle] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved && ANIMATION_MODES.some((m) => m.id === saved)) setModeId(saved);
			if (localStorage.getItem(AUTO_KEY) === "1") setAutoCycle(true);
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, modeId);
			localStorage.setItem(AUTO_KEY, autoCycle ? "1" : "0");
		} catch {}
	}, [
		modeId,
		autoCycle,
		hydrated
	]);
	const mode = (0, import_react.useMemo)(() => ANIMATION_MODES.find((m) => m.id === modeId) ?? ANIMATION_MODES[0], [modeId]);
	const index = modeIndex(mode.id);
	const goNext = (0, import_react.useCallback)(() => setModeId((id) => nextModeId(id)), []);
	const goPrev = (0, import_react.useCallback)(() => setModeId((id) => prevModeId(id)), []);
	(0, import_react.useEffect)(() => {
		if (!autoCycle) return;
		const t = window.setInterval(goNext, CYCLE_MS);
		return () => window.clearInterval(t);
	}, [autoCycle, goNext]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.target instanceof HTMLElement) {
				const tag = e.target.tagName;
				if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) return;
			}
			if (e.key === "ArrowRight" || e.key === " ") {
				e.preventDefault();
				goNext();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				goPrev();
			} else if (e.key === "a" || e.key === "A") setAutoCycle((v) => !v);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [goNext, goPrev]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackgroundStage, { mode }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell",
		"data-surface": mode.surface,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "app-top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "brand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "brand__eyebrow",
						children: "000.github.io · sampler"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "brand__title",
						children: "Background Animation Archive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "brand__sub",
						children: "Every distinct background from the GitHub Pages index history — toggle, select, or auto-cycle through eras."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "brand__hint",
						children: "Keys: ← → to switch · A to auto-cycle · click halo modes"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "app-main",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimationPicker, {
				mode,
				index,
				autoCycle,
				onSelect: setModeId,
				onPrev: goPrev,
				onNext: goNext,
				onToggleAuto: () => setAutoCycle((v) => !v)
			})
		})]
	})] });
}
//#endregion
export { Home as component };
