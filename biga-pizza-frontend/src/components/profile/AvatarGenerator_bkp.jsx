// src/components/profile/AvatarGenerator.jsx
import { useRef, useEffect, useState } from 'react';
import KaleidoAvatar from './KaleidoSticksAvatar'; // make sure this is the sticks version
import { Dice6 } from 'lucide-react';

// ... existing helpers & MandalaCanvas ...

export default function AvatarGenerator({
  type = 'kaleido', // 'kaleido' | 'mandala'
  seed = 'BigaPizza',
  size = 96,
  className = '',
  onChange,
  onTypeChange,
  onSeedChange,
  showControls = true, // 👈 NEW: default true (profile pages)
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

      {/* controls — hidden when showControls is false */}
      {showControls && (
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
      )}
    </div>
  );
}
