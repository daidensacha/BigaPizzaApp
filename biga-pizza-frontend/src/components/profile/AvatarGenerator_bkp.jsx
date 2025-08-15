import { useMemo, useRef, useEffect, useState } from 'react';
import KaleidoAvatar from './KaleidoAvatar';
import { Dice6 } from 'lucide-react';

/** same PRNG helpers so seeds behave the same across styles */
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

/** small canvas-based mandala (geometric) */
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

    // soft background circle to match the white circle footprint
    ctx.save();
    ctx.translate(size / 2, size / 2);
    const r = size * 0.48;
    const bg = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    bg.addColorStop(0, 'rgba(255,255,255,0.4)');
    bg.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // geometric wedges
    const segments = 12;
    const wedges = 8;
    ctx.save();
    ctx.translate(size / 2, size / 2);

    for (let w = 0; w < wedges; w++) {
      const color = palette[Math.floor(rnd() * palette.length)];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      const inner = size * (0.1 + rnd() * 0.18);
      const outer = size * (0.28 + rnd() * 0.2);
      const thickness = 0.6 + rnd() * 0.6;

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
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.restore();
      }
    }

    // center dot for compositional balance
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.06, 0, Math.PI * 2);
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

/**
 * AvatarGenerator (wrapper)
 * - type: 'kaleido' | 'mandala'
 * - seed: string
 * - onChange({ type, seed })
 */
export default function AvatarGenerator({
  type = 'kaleido',
  seed = 'BigaPizza',
  size = 96, // <= keep this modest so it doesn’t balloon
  className = '',
  onChange,
}) {
  // simple seed roll
  const roll = () => {
    const next = `${Date.now().toString(36)}-${Math.floor(
      Math.random() * 1e6
    ).toString(36)}`;
    onChange?.({ type, seed: next });
  };

  const switchTo = (t) => onChange?.({ type: t, seed });
  const [isRolling, setIsRolling] = useState(false);
  const handleRollClick = () => {
    const newSeed = Date.now().toString();
    if (onSeedChange) onSeedChange(newSeed); // update parent
    setInternalSeed(newSeed); // update local preview
    setIsRolling(true);
    setTimeout(() => setIsRolling(false), 500);
  };

  return (
    <div className="flex items-center gap-4">
      {/* avatar preview */}
      <div className="shrink-0">
        {type === 'kaleido' ? (
          <KaleidoAvatar seed={seed} size={size} rounded className="" />
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

        {/* Dice icon instead of text button */}
        <button
          onClick={handleRollClick}
          className="p-2 rounded"
          aria-label="Roll new avatar"
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
