"use client";

import { useEffect, useRef } from "react";

export type DayRange = { start: number; end: number };

/**
 * The day as 1440 minute particles on a tilted ring. Monochrome on purpose: state is carried by
 * brightness and size only, and the ink is read from the canvas `color` so both themes follow tokens.
 */
export function DayRing({
  selected,
  pulse,
  booked,
  className,
}: {
  selected: DayRange | null;
  pulse: number;
  booked: { start: number; end: number; block?: boolean }[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({ selected, pulse, burst: 0, lastPulse: pulse });
  state.current.selected = selected;
  if (pulse !== state.current.lastPulse) {
    state.current.lastPulse = pulse;
    state.current.burst = 1;
  }
  const bookedRef = useRef(booked);
  bookedRef.current = booked;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    let frame = 0;
    let ink = getComputedStyle(cv).color;
    const N = 1440;
    const P = Array.from({ length: N }, (_, i) => ({
      a: (i / N) * Math.PI * 2,
      j: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 6,
      s: Math.random(),
    }));
    const bookedMask = new Uint8Array(N);
    for (const b of bookedRef.current) {
      for (let m = b.start; m < b.end && m < N; m++) bookedMask[m] = b.block ? 2 : 1;
    }
    let spin = 0;
    let spinT = 0;
    let tilt = 1.05;
    let tiltT = 1.05;
    let yaw = 0;
    let yawT = 0;
    let intro = 0;
    let selP = 0;
    let lastSel = "";

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();

    const onMove = (e: PointerEvent) => {
      yawT = (e.clientX / window.innerWidth - 0.5) * 0.45;
      tiltT = 1.05 + (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = (t: number) => {
      // Theme can flip at runtime; re-reading the token every second is cheap enough.
      if (frame++ % 60 === 0) ink = getComputedStyle(cv).color;
      const st = state.current;
      const sel = st.selected;
      const key = sel ? `${sel.start}-${sel.end}` : "";
      if (key !== lastSel) {
        lastSel = key;
        selP = 0;
        if (sel) {
          const mid = ((sel.start + sel.end) / 2 / N) * Math.PI * 2;
          let target = Math.PI - mid;
          while (target - spin > Math.PI) target -= Math.PI * 2;
          while (target - spin < -Math.PI) target += Math.PI * 2;
          spinT = target;
        }
      }
      intro = Math.min(1, intro + (reduce ? 1 : 0.012));
      const ie = 1 - (1 - intro) ** 3;
      if (!sel) spinT += 0.0005;
      spin += (spinT - spin) * 0.045;
      tilt += (tiltT - tilt) * 0.05;
      yaw += (yawT - yaw) * 0.05;
      if (sel) selP = Math.min(1, selP + 0.03);
      st.burst *= 0.96;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      ctx.strokeStyle = ink;
      const base = 0.3;
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.42;
      const ct = Math.cos(tilt);
      const stl = Math.sin(tilt);
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const F = 1100;
      const proj = (x: number, y: number, z: number) => {
        const y1 = y * ct - z * stl;
        const z1 = y * stl + z * ct;
        const x2 = x * cyw + z1 * syw;
        const z2 = -x * syw + z1 * cyw;
        const f = F / (F + z2);
        return [cx + x2 * f, cy + y1 * f, f] as const;
      };
      const now = new Date();
      const nm = now.getHours() * 60 + now.getMinutes();
      for (let i = 0; i < N; i++) {
        const p = P[i];
        const a = p.a + spin;
        let rr = R * (0.7 + 0.3 * ie) + p.j;
        let alpha = base * (0.5 + p.s * 0.6);
        let sz = 1.45;
        const behind = (nm - i + N) % N;
        if (behind < 180) {
          const tr = Math.exp(-behind / 50);
          alpha += tr * 0.6;
          sz += tr * 0.8;
        }
        if (bookedMask[i] === 1) {
          rr += 5 + Math.sin(t * 0.002 + i * 0.05) * 1.2;
          alpha = Math.max(alpha, 0.55);
          sz = 1.5;
        }
        if (bookedMask[i] === 2) alpha *= 0.4;
        if (i % 60 === 0) {
          rr -= 12;
          sz = 2;
          alpha = Math.max(alpha, base * 2.4);
        }
        if (sel && i >= sel.start && i < sel.end) {
          rr += (14 + Math.sin(t * 0.004 + i * 0.2) * 2.5) * selP;
          alpha = 0.4 + 0.6 * selP;
          sz = 1.5 + 2 * selP;
        }
        if (st.burst > 0.01) {
          rr += st.burst * (14 + p.s * 36);
          alpha = Math.max(alpha, st.burst * 0.7 * p.s);
        }
        const [px, py, f] = proj(Math.sin(a) * rr, -Math.cos(a) * rr, p.z);
        const d = Math.max(0.35, Math.min(1.2, f));
        const s = sz * d;
        ctx.globalAlpha = Math.min(1, alpha * d) * ie;
        ctx.fillRect(px - s / 2, py - s / 2, s, s);
      }
      const na = (nm / N) * Math.PI * 2 + spin;
      const [hx, hy] = proj(Math.sin(na) * R * 0.9 * ie, -Math.cos(na) * R * 0.9 * ie, 0);
      const [ex, ey] = proj(Math.sin(na) * (R + 22) * ie, -Math.cos(na) * (R + 22) * ie, 0);
      ctx.globalAlpha = 0.9 * ie;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.globalAlpha = ie;
      ctx.beginPath();
      ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '500 11px "Geist Mono", ui-monospace, monospace';
      ctx.fillText(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        ex + 8,
        ey + 4
      );
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (!visible) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(cv);
    if (reduce) {
      intro = 1;
      draw(0);
    } else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
