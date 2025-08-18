// NumberInputGroup.jsx
import { useRef, useEffect, useState, useCallback, memo } from 'react';

const SIZE_STYLES = {
  xs: {
    wrapMin: 'min-w-[9.5rem]',
    label: 'text-[10px]',
    btn: 'h-6 px-2 text-[11px] rounded',
    input: 'h-6 w-16 text-[11px] rounded',
    hint: 'text-[9px]',
  },
  sm: {
    btn: 'h-7 px-2.5 text-xs rounded',
    input: 'h-7 w-16 text-xs rounded',
    hint: 'text-[10px]',
    label: 'text-[11px]',
    wrapMin: 'min-w-[9.5rem]',
  },
  md: {
    btn: 'h-8 px-3 text-sm rounded-md',
    input: 'h-8 w-20 text-sm rounded-md',
    hint: 'text-[10px]',
    label: 'text-xs',
    wrapMin: 'min-w-[11rem]',
  },
};

function NumberInputGroup({
  label,
  value, // number
  onChange, // (next: number) => void
  min,
  max,
  step = 1,
  unit,
  className = '',
  firstDelay = 350,
  repeatDelay = 85,
  size = 'sm', // ⬅️ NEW: 'sm' | 'md'
  align = 'center', // new prop
}) {
  const S = SIZE_STYLES[size] ?? SIZE_STYLES.sm;

  const alignClass = align === 'start' ? 'items-start' : 'items-center';
  const labelAlign = align === 'start' ? 'text-left' : 'text-center';

  const clamp = useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  const valueRef = useRef(typeof value === 'number' ? value : 0);
  useEffect(() => {
    valueRef.current = typeof value === 'number' ? value : 0;
  }, [value]);

  const [draft, setDraft] = useState(value ?? '');
  useEffect(() => setDraft(value ?? ''), [value]);

  const setValueClamped = useCallback(
    (n) => {
      const next = clamp(n);
      if (next !== valueRef.current) {
        valueRef.current = next;
        onChange(next);
      }
      setDraft(next);
    },
    [clamp, onChange]
  );

  const commitDraft = useCallback(() => {
    const n = Number(draft);
    if (!Number.isFinite(n)) {
      setDraft(valueRef.current ?? '');
      return;
    }
    setValueClamped(n);
  }, [draft, setValueClamped]);

  const stepOnce = useCallback(
    (dir) => {
      const delta = dir === 'inc' ? step : -step;
      setValueClamped((valueRef.current ?? 0) + delta);
    },
    [step, setValueClamped]
  );

  // hold-to-repeat
  const holdingRef = useRef(false);
  const startTimerRef = useRef(null);
  const repeatTimerRef = useRef(null);
  const repeatStartedRef = useRef(false);
  const dirRef = useRef('inc');

  const clearTimers = useCallback(() => {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    repeatStartedRef.current = false;
  }, []);

  const stopHold = useCallback(() => {
    if (!holdingRef.current) return;
    if (!repeatStartedRef.current) stepOnce(dirRef.current);
    holdingRef.current = false;
    clearTimers();
  }, [clearTimers, stepOnce]);

  const startHold = useCallback(
    (dir, e) => {
      e?.preventDefault?.();
      commitDraft();
      holdingRef.current = true;
      dirRef.current = dir;
      clearTimers();
      startTimerRef.current = setTimeout(() => {
        if (!holdingRef.current) return;
        repeatStartedRef.current = true;
        repeatTimerRef.current = setInterval(() => {
          if (!holdingRef.current) return;
          stepOnce(dirRef.current);
        }, repeatDelay);
      }, firstDelay);
    },
    [commitDraft, stepOnce, clearTimers, firstDelay, repeatDelay]
  );

  useEffect(
    () => () => {
      holdingRef.current = false;
      clearTimers();
    },
    [clearTimers]
  );

  useEffect(() => {
    if (holdingRef.current) return;
    setDraft(value ?? '');
  }, [value]);

  const inputId = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined;

  return (
    <div
      className={`flex flex-col gap-1 ${alignClass} ${S.wrapMin} ${className}`}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={`${S.label} font-medium text-zinc-600 dark:text-stone-400 ${labelAlign}`}
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-1.5 select-none whitespace-nowrap">
        <button
          type="button"
          className={`${S.btn} bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700`}
          onPointerDown={(e) => startHold('dec', e)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          aria-label="decrement"
        >
          −
        </button>

        <input
          id={inputId}
          name={inputId}
          type="number"
          value={draft}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className={`${S.input} text-center border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-zinc-300/15`}
          style={{ MozAppearance: 'textfield' }}
        />

        <button
          type="button"
          className={`${S.btn} bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700`}
          onPointerDown={(e) => startHold('inc', e)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          aria-label="increment"
        >
          +
        </button>
      </div>

      <div className={`${S.hint} text-zinc-500`}>
        Min {min} / Max {max} {unit ?? ''}
      </div>
    </div>
  );
}

export default memo(NumberInputGroup);
