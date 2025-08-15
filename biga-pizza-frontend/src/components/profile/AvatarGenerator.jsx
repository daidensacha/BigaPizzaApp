// src/components/profile/AvatarGenerator.jsx
import { useRef, useEffect, useState } from 'react';
import KaleidoAvatar from './KaleidoAvatar'; // your exact zen implementation
import { Dice6 } from 'lucide-react';

/* ---- tiny PRNG helpers (same family as KaleidoAvatar) ---- */
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

/* ---- Mandala (geometric) canvas renderer ---- */
function MandalaCanvas({ seed, size, className }) {
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

    ctx.clearRect(0, 0, size, size);

    // subtle soft bloom inside circle footprint
    ctx.save();
    ctx.translate(size / 2, size / 2);
    const r = size * 0.48;
    const bg = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    bg.addColorStop(0, 'rgba(255,255,255,0.35)');
    bg.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // geometric symmetry
    const segments = 12;
    const wedges = 8;

    ctx.save();
    ctx.translate(size / 2, size / 2);
    for (let w = 0; w < wedges; w++) {
      const color = palette[Math.floor(rnd() * palette.length)];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      const inner = size * (0.12 + rnd() * 0.18);
      const outer = size * (0.28 + rnd() * 0.2);
      const thickness = 0.6 + rnd() * 0.7;

      for (let s = 0; s < segments; s++) {
        ctx.save();
        ctx.rotate((s * Math.PI * 2) / segments);

        // ring arc
        ctx.beginPath();
        ctx.arc(0, 0, outer, -0.12, 0.12);
        ctx.lineWidth = thickness;
        ctx.stroke();

        // diamond-ish tile
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
    ctx.arc(size / 2, size / 2, size * 0.06, 0, Math.PI * 2);
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

/* ---- AvatarGenerator wrapper ---- */
export default function AvatarGenerator({
  type = 'kaleido', // 'kaleido' | 'mandala'
  seed = 'BigaPizza',
  size = 96, // keep modest (64–96 ideal in Profile)
  className = '',
  onChange, // optional: ({ type, seed }) => void
  onTypeChange, // optional: (type) => void
  onSeedChange, // optional: (seed) => void
}) {
  const [isRolling, setIsRolling] = useState(false);

  const emitType = (nextType) => {
    onChange ? onChange({ type: nextType, seed }) : onTypeChange?.(nextType);
  };

  const emitSeed = (nextSeed) => {
    if (onChange) onChange({ type, seed: nextSeed });
    else onSeedChange?.(nextSeed);
  };

  const switchTo = (nextType) => emitType(nextType);

  const roll = () => {
    const nextSeed = `${Date.now().toString(36)}-${Math.floor(
      Math.random() * 1e6
    ).toString(36)}`;
    emitSeed(nextSeed);
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 450);
  };

  return (
    <div className={['flex items-center gap-4', className].join(' ')}>
      {/* preview */}
      <div className="shrink-0">
        {type === 'kaleido' ? (
          <KaleidoAvatar seed={seed} size={size} rounded />
        ) : (
          <MandalaCanvas seed={seed} size={size} />
        )}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              type === 'kaleido'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-stone-800'
            }`}
            onClick={() => switchTo('kaleido')}
          >
            Zen
          </button>
          <button
            className={`px-3 py-1 text-sm ${
              type === 'mandala'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-stone-800'
            }`}
            onClick={() => switchTo('mandala')}
          >
            Mandala
          </button>
        </div>

        <button
          onClick={roll}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="Roll new avatar"
          title="Roll new avatar"
        >
          <Dice6
            className={`w-5 h-5 text-stone-700 dark:text-stone-300 ${
              isRolling ? 'animate-spin' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
