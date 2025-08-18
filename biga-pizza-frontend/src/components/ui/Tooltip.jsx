// src/components/ui/Tooltip.jsx
import { useState, useRef, useEffect } from 'react';
import { Transition } from '@headlessui/react';

/**
 * Tooltip
 * - Headless UI Transition + Tailwind
 * - Dark-mode aware
 * - Keyboard accessible (focus/blur)
 *
 * Props:
 *  - content: string | ReactNode
 *  - side: 'top' | 'bottom' | 'left' | 'right' (default 'top')
 *  - delay: ms before showing (default 200)
 *  - className: extra classes for the bubble
 */
export default function Tooltip({
  children,
  content,
  side = 'top',
  delay = 200,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  };

  const show = () => {
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), 40);
  };

  useEffect(() => () => clearTimers(), []);

  // Positioning classes
  // Tooltip.jsx – tweak position map a touch
  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2',
  }[side];

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Trigger */}
      <span tabIndex={0} className="inline-flex">
        {children}
      </span>

      {/* Bubble */}
      <Transition
        show={open}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <span
          role="tooltip"
          className={['pointer-events-none absolute z-[60]', pos].join(' ')}
        >
          <span
            className={[
              // bubble
              'block max-w-xs min-w-[8rem] rounded-lg px-2.5 py-1.5 text-xs leading-snug shadow-lg border text-left',
              // light / dark
              'bg-white/95 border-zinc-200 text-zinc-800',
              'dark:bg-zinc-900/95 dark:border-zinc-700 dark:text-zinc-100',
              // backdrop blend
              'backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-zinc-900/80',
              'whitespace-normal break-words',
              className,
            ].join(' ')}
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              writingMode: 'horizontal-tb', // <- force horizontal text flow
            }}
          >
            {typeof content === 'string'
              ? content
                  .replace(/\s*\n+\s*/g, ' ')
                  .replace(/\s{2,}/g, ' ')
                  .trim()
              : content}
          </span>
        </span>
      </Transition>
    </span>
  );
}
