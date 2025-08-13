import { useRef, useEffect, useState, useCallback, memo } from 'react';

function NumberInputGroup({
  label,
  value, // number
  onChange, // (next: number) => void
  min,
  max,
  step = 1,
  unit,
  className = '',
  firstDelay = 350, // ms before repeating starts
  repeatDelay = 85, // ms between repeats
}) {
  // ---- basic helpers ----
  const clamp = useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  // Latest committed value for repeat loop
  const valueRef = useRef(typeof value === 'number' ? value : 0);
  useEffect(() => {
    valueRef.current = typeof value === 'number' ? value : 0;
  }, [value]);

  // Draft for natural typing
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

  // ---- hold-to-repeat (minimal globals; added on start, removed on stop) ----
  // --- Hold-to-repeat (per-button, minimal globals) ---
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

    // If released before repeat began, treat as a single click
    if (!repeatStartedRef.current) {
      stepOnce(dirRef.current);
    }

    holdingRef.current = false;
    clearTimers();
  }, [clearTimers, stepOnce]);

  const startHold = useCallback(
    (dir, e) => {
      e?.preventDefault?.();

      // start from what’s visible
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

  // 1) cleanup on unmount
  useEffect(() => {
    return () => {
      holdingRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  // 2) keep draft in sync when not holding
  useEffect(() => {
    if (holdingRef.current) return;
    setDraft(value ?? '');
  }, [value]);

  const inputId = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined;

  return (
    <div
      className={`flex flex-col gap-1 items-center min-w-[11rem] ${className}`}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-300 text-center"
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-2 select-none whitespace-nowrap">
        <button
          type="button"
          className="h-8 px-3 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
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
          className="h-8 w-20 text-center border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-zinc-300/20"
          style={{ MozAppearance: 'textfield' }}
        />

        {unit && (
          <span className="inline-flex h-8 items-center px-2 text-xs rounded-md border border-zinc-300 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700">
            {unit}
          </span>
        )}

        <button
          type="button"
          className="h-8 px-3 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onPointerDown={(e) => startHold('inc', e)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          aria-label="increment"
        >
          +
        </button>
      </div>

      <div className="text-[10px] text-zinc-500">
        Min {min} / Max {max} {unit ?? ''}
      </div>
    </div>
  );
}

export default memo(NumberInputGroup);
