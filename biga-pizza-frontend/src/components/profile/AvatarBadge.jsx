/**
 * AvatarBadge
 * -----------
 * Read-only avatar renderer for small spaces (navbar, dropdowns, etc.).
 *
 * ✅ Accepts { type, seed, size } props
 * ✅ No UI controls (no Zen/Mandala buttons, no dice roll)
 *
 * 🚫 Do NOT use this for editing avatars — use AvatarGenerator instead.
 */
import React, { useRef, useEffect } from 'react';
import KaleidoAvatar from '@/components/profile/KaleidoAvatar'; // your “Zen” component

// --- tiny PRNG helpers (same as elsewhere) ---
function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

// Minimal mandala renderer (same look as generator, but read-only)
function MandalaBadge({ seed, size, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    ctx.resetTransform?.();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rnd = mulberry32(hashSeed(String(seed)));
    const baseHue = Math.floor(rnd() * 360);
    const palette = [
      hsl(baseHue, 70, 50),
      hsl((baseHue + 40) % 360, 65, 55),
      hsl((baseHue + 200) % 360, 60, 50),
      hsl((baseHue + 320) % 360, 65, 45),
    ];

    const s = size;
    ctx.clearRect(0, 0, s, s);

    // subtle bloom
    ctx.save();
    ctx.translate(s / 2, s / 2);
    const r = s * 0.48;
    const bg = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    bg.addColorStop(0, 'rgba(255,255,255,0.35)');
    bg.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // geometry
    const segments = 12;
    const wedges = 8;
    for (let w = 0; w < wedges; w++) {
      const color = palette[Math.floor(rnd() * palette.length)];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      const inner = s * (0.12 + rnd() * 0.18);
      const outer = s * (0.28 + rnd() * 0.2);
      const thickness = 0.6 + rnd() * 0.7;

      for (let k = 0; k < segments; k++) {
        ctx.save();
        ctx.rotate((k * Math.PI * 2) / segments);

        ctx.beginPath();
        ctx.arc(0, 0, outer, -0.12, 0.12);
        ctx.lineWidth = thickness;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(inner, 0);
        ctx.lineTo((inner + outer) / 2, -thickness * 2);
        ctx.lineTo(outer, 0);
        ctx.lineTo((inner + outer) / 2, thickness * 2);
        ctx.closePath();
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.restore();
      }
    }

    // center dot
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = palette[0];
    ctx.fill();
    ctx.restore();
  }, [seed, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={[
        'rounded-full border border-stone-300 dark:border-stone-700',
        className,
      ].join(' ')}
      aria-label="Avatar"
    />
  );
}

export default function AvatarBadge({
  type = 'kaleido', // 'kaleido' | 'mandala'
  seed = 'BigaPizza',
  size = 28, // 24–32 works well in nav
  className = '',
}) {
  return type === 'kaleido' ? (
    <KaleidoAvatar seed={seed} size={size} rounded className={className} />
  ) : (
    <MandalaBadge seed={seed} size={size} className={className} />
  );
}
