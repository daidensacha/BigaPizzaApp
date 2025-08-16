// src/components/profile/KaleidoSticksAvatar.jsx
import { useEffect, useRef } from 'react';

/* deterministic PRNG */
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

/**
 * Zen "sticks" avatar:
 * - Thin straight spokes, symmetric, airy (no fills)
 * - Deterministic from seed
 */
export default function KaleidoSticksAvatar({
  seed = 'BigaPizza',
  size = 96,
  segments = 12, // symmetry spokes (10–16 looks great)
  rings = 6, // layers of spokes
  className = '',
  rounded = true,
}) {
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

    // Palette: cooler + warmer mates around a base hue
    const baseHue = Math.floor(rnd() * 360);
    const palette = [
      hsl(baseHue, 70, 45),
      hsl((baseHue + 25) % 360, 70, 55),
      hsl((baseHue + 200) % 360, 60, 52),
      hsl((baseHue + 320) % 360, 62, 46),
    ];

    const S = size;
    ctx.clearRect(0, 0, S, S);

    // faint soft vignette so sticks don’t feel like they “float”
    if (rnd() > 0.4) {
      const g = ctx.createRadialGradient(
        S / 2,
        S / 2,
        2,
        S / 2,
        S / 2,
        S * 0.55
      );
      g.addColorStop(0, 'rgba(255,255,255,0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.49, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.translate(S / 2, S / 2);

    const angleStep = (Math.PI * 2) / segments;
    const rMax = S * 0.46;

    // draw several concentric "rings" of straight sticks
    for (let ring = 0; ring < rings; ring++) {
      const color = palette[Math.floor(rnd() * palette.length)];
      const lineW = 0.7 + rnd() * 1.3; // thin lines
      const inner =
        rMax * (0.15 + (ring / rings) * 0.75 * (0.85 + rnd() * 0.1));
      const span = rMax * (0.08 + rnd() * 0.18); // stick length
      const outer = Math.min(rMax, inner + span);

      for (let s = 0; s < segments; s++) {
        ctx.save();
        ctx.rotate(s * angleStep + rnd() * 0.02); // micro jitter for organic feel
        ctx.beginPath();
        ctx.moveTo(inner, 0);
        ctx.lineTo(outer, 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.restore();
      }
    }

    // tiny center dot
    ctx.beginPath();
    ctx.arc(0, 0, S * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = palette[0];
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [seed, size, segments, rings]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={[
        rounded ? 'rounded-full' : 'rounded-xl',
        'border border-stone-300 dark:border-stone-700',
        className,
      ].join(' ')}
      aria-label="Avatar"
    />
  );
}
