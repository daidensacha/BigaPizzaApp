import { useRef, useEffect, useState, useCallback } from 'react';

export default function NumberInputGroup({
  label,
  value, // number
  onChange, // (nextNumber: number) => void
  min,
  max,
  step = 1,
  unit,
  className = '',
}) {
  const clamp = useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  // Latest committed value for the repeater (avoid stale closures)
  const valueRef = useRef(typeof value === 'number' ? value : 0);
  useEffect(() => {
    valueRef.current = typeof value === 'number' ? value : 0;
  }, [value]);

  // Draft for natural typing
  const [draft, setDraft] = useState(value ?? '');
  useEffect(() => setDraft(value ?? ''), [value]);

  function setValueClamped(n) {
    const next = clamp(n);
    if (next !== valueRef.current) {
      valueRef.current = next;
      onChange(next);
    }
    setDraft(String(next));
  }

  const commitDraft = useCallback(() => {
    const n = Number(draft);
    if (!Number.isFinite(n)) {
      setDraft(String(valueRef.current ?? ''));
      return;
    }
    setValueClamped(n);
  }, [draft, clamp]);

  // One step
  function stepOnce(dir) {
    const delta = dir === 'inc' ? step : -step;
    setValueClamped((valueRef.current ?? 0) + delta);
  }

  // --- Hold-to-repeat ---
  const runningRef = useRef(false);
  const t1 = useRef(null);
  const t2 = useRef(null);
  const dirRef = useRef('inc');
  const visHandlerRef = useRef(null);

  function clearTimers() {
    if (t1.current) {
      clearTimeout(t1.current);
      t1.current = null;
    }
    if (t2.current) {
      clearInterval(t2.current);
      t2.current = null;
    }
  }

  function stopHold() {
    if (!runningRef.current) return;
    runningRef.current = false;
    clearTimers();

    window.removeEventListener('mouseup', stopHold, true);
    window.removeEventListener('mouseleave', stopHold, true);
    window.removeEventListener('touchend', stopHold, true);
    window.removeEventListener('touchcancel', stopHold, true);
    window.removeEventListener('blur', stopHold, true);
    if (visHandlerRef.current) {
      document.removeEventListener(
        'visibilitychange',
        visHandlerRef.current,
        true
      );
      visHandlerRef.current = null;
    }
  }

  function tick() {
    const v = valueRef.current ?? 0;
    const delta = dirRef.current === 'inc' ? step : -step;
    const next = v + delta;
    if (next < min || next > max) {
      stopHold();
      return;
    }
    setValueClamped(next);
  }

  function startHold(dir) {
    // commit what the user sees so repeat starts from that
    commitDraft();

    // fresh start each press
    stopHold();
    runningRef.current = true;
    dirRef.current = dir;

    tick(); // immediate first step

    t1.current = setTimeout(() => {
      t2.current = setInterval(tick, 60);
    }, 150);

    // stop on release / blur / tab change
    window.addEventListener('mouseup', stopHold, true);
    window.addEventListener('mouseleave', stopHold, true);
    window.addEventListener('touchend', stopHold, true);
    window.addEventListener('touchcancel', stopHold, true);
    window.addEventListener('blur', stopHold, true);
    visHandlerRef.current = () => {
      if (document.hidden) stopHold();
    };
    document.addEventListener('visibilitychange', visHandlerRef.current, true);
  }

  useEffect(() => stopHold, []); // cleanup on unmount

  const inputId = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-300"
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-2 select-none">
        <button
          type="button"
          className="h-8 px-3 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onMouseDown={(e) => {
            e.preventDefault();
            startHold('dec');
          }}
          onMouseUp={stopHold}
          onTouchStart={() => startHold('dec')}
          onTouchEnd={stopHold}
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
          onChange={(e) => setDraft(e.target.value)} // free typing
          onBlur={commitDraft} // commit on blur
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
          onMouseDown={(e) => {
            e.preventDefault();
            startHold('inc');
          }}
          onMouseUp={stopHold}
          onTouchStart={() => startHold('inc')}
          onTouchEnd={stopHold}
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
