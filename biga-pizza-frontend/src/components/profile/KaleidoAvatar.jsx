import { useEffect, useRef } from 'react';

/** tiny deterministic PRNG from a string seed */
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

function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * KaleidoAvatar
 * - deterministic from `seed`
 * - no network, renders to <canvas>
 */
export default function KaleidoAvatar({
  seed = 'BigaPizza',
  size = 96,
  segments = 8, // symmetry level (6–12 looks good)
  shapes = 14, // how many motif strokes
  className = '',
  rounded = true, // true -> circle crop via CSS
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

    // deterministic RNG from seed
    const rnd = mulberry32(hashSeed(String(seed)));

    // palette: pick a base hue, derive mates
    const baseHue = Math.floor(rnd() * 360);
    const palette = [
      hsl(baseHue, 70, 45),
      hsl((baseHue + 30) % 360, 70, 55),
      hsl((baseHue + 320) % 360, 65, 45),
      hsl((baseHue + 200) % 360, 55, 50),
    ];

    // clear transparent
    ctx.clearRect(0, 0, size, size);

    // optional soft background bloom (very faint)
    if (rnd() > 0.5) {
      const grad = ctx.createRadialGradient(
        size * 0.5,
        size * 0.5,
        4,
        size * 0.5,
        size * 0.5,
        size * 0.6
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.06)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.5, size * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.translate(size / 2, size / 2);

    const drawMotif = () => {
      const rMax = size * 0.45;
      const r1 = rMax * (0.15 + rnd() * 0.85);
      const r2 = rMax * (0.15 + rnd() * 0.85);
      const a1 = rnd() * Math.PI * 2;
      const a2 = a1 + (rnd() * Math.PI) / 2;

      const color = palette[Math.floor(rnd() * palette.length)];
      const lineW = 1 + rnd() * 2.2;

      // path: small curved stroke between two polar points
      ctx.beginPath();
      ctx.moveTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
      const cx = Math.cos((a1 + a2) / 2) * ((r1 + r2) / 2);
      const cy = Math.sin((a1 + a2) / 2) * ((r1 + r2) / 2);
      ctx.quadraticCurveTo(cx, cy, Math.cos(a2) * r2, Math.sin(a2) * r2);

      ctx.strokeStyle = color;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.stroke();

      // occasional filled dot
      if (rnd() > 0.65) {
        ctx.beginPath();
        ctx.arc(
          Math.cos(a1) * r1,
          Math.sin(a1) * r1,
          1 + rnd() * 2.5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    // draw the motif, rotate around center for symmetry
    for (let i = 0; i < shapes; i++) {
      const angle = (Math.PI * 2) / segments;
      for (let s = 0; s < segments; s++) {
        ctx.save();
        ctx.rotate(angle * s);
        drawMotif();
        ctx.restore();
      }
    }
  }, [seed, size, segments, shapes]);

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
