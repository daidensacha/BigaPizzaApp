// src/pages/account/UserDefaults.jsx
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDefaults } from '@/context/DefaultsContext';
import { useRecipe } from '@/context/RecipeContext';

import inputConfig from '@/constants/inputConfig';
import {
  defaultFormData,
  defaultScheduleData,
} from '@/constants/defaultInputSettings';

import NumberInputGroup from '@/components/ui/NumberInputGroup';
import YeastToggleButtonGroup from '@/components/ui/YeastToggleButtonGroup';

/* ----------------------------- UI helpers ----------------------------- */

function GroupCard({ title, children }) {
  return (
    <fieldset className="rounded-xl p-4 border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900">
      <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-300">
        {title}
      </legend>
      <div className="space-y-4 mt-2">{children}</div>
    </fieldset>
  );
}

function SubFieldset({ legend, children }) {
  return (
    <fieldset className="rounded-lg border border-stone-200/70 dark:border-stone-700 p-3">
      <legend className="px-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
        {legend}
      </legend>
      {/* Internal grid for inputs */}
      <div className="mt-2 grid gap-3 sm:grid-cols-2 items-start">
        {children}
      </div>
    </fieldset>
  );
}

function TwoColFieldsets({ groups, state, setState, size = 'sm' }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left column (first two groups) */}
      <div className="grid gap-4">
        {groups.slice(0, 2).map((g) => (
          <SubFieldset key={g.legend} legend={g.legend}>
            <RenderSubGroup
              keys={g.keys}
              state={state}
              setState={setState}
              size={size}
              align="start"
            />
          </SubFieldset>
        ))}
      </div>
      {/* Right column (remaining groups) */}
      <div className="grid gap-4">
        {groups.slice(2).map((g) => (
          <SubFieldset key={g.legend} legend={g.legend}>
            <RenderSubGroup
              keys={g.keys}
              state={state}
              setState={setState}
              size={size}
              align="start"
            />
          </SubFieldset>
        ))}
      </div>
    </div>
  );
}

/** Simple 3-option toggle for yeast type; uses inputConfig.yeastType.options */
function YeastTypeToggle({
  value,
  onChange,
  options = ['idy', 'ady', 'fresh'],
  size = 'sm',
}) {
  const S = {
    xs: { btn: 'h-6 px-2 text-[11px]', gap: 'gap-1', label: 'text-[10px]' },
    sm: { btn: 'h-8 px-3 text-xs', gap: 'gap-2', label: 'text-xs' },
    md: { btn: 'h-9 px-3 text-sm', gap: 'gap-2', label: 'text-sm' },
  }[size];

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${S.label} font-medium text-zinc-600 dark:text-stone-400 text-center mb-1`}
      >
        Yeast Type
      </div>
      <div className={`inline-flex ${S.gap}`}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={[
                S.btn,
                'rounded-md border',
                active
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700',
              ].join(' ')}
            >
              {opt.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Renders a set of keys with NumberInputGroup (and special-cases yeastType) */
function RenderSubGroup({ keys, state, setState, size = 'sm' }) {
  return keys.map((key) => {
    if (key === 'yeastType') {
      const opts = inputConfig.yeastType?.options || ['idy', 'ady', 'fresh'];
      return (
        <div key="yeastType" className="flex justify-start">
          <YeastToggleButtonGroup
            key="yeastType"
            value={state.yeastType}
            onChange={(v) => setState((p) => ({ ...p, yeastType: v }))}
            options={['idy', 'ady', 'fresh']}
            size="xs"
            align="start"
            optionHelp={{
              idy: 'Instant Dry Yeast',
              ady: 'Active Dry Yeast',
              fresh: 'Fresh yeast',
              side: 'bottom',
            }}
          />
        </div>
      );
    }

    const cfg = inputConfig[key] || { label: key };
    return (
      <NumberInputGroup
        key={key}
        label={cfg.label}
        value={state[key]}
        onChange={(v) => setState((p) => ({ ...p, [key]: v }))}
        {...cfg}
        size={size}
        align="start"
      />
    );
  });
}

/* ----------------------------- Page component ----------------------------- */

export default function UserDefaults() {
  const { defaults, save, saving, reset } = useDefaults();
  const { setFormData, setScheduleData } = useRecipe();

  // Good: start with system defaults so the UI is always controlled
  const [dough, setDough] = useState({ ...defaultFormData });
  const [sched, setSched] = useState({ ...defaultScheduleData });
  const [restoring, setRestoring] = useState(false);
  const busy = saving || restoring; //

  // Sync when defaults arrive
  useEffect(() => {
    if (!defaults) return;
    setDough({ ...(defaults.doughDefaults || defaultFormData) });
    setSched({ ...(defaults.scheduleDefaults || defaultScheduleData) });
  }, [defaults]);

  const Spinner = ({ label }) => (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  /* ------------ Grouping definitions (keeps 2 main cards) ------------ */

  const DOUGH_GROUPS = useMemo(
    () => [
      {
        legend: 'My Pizza Preferences',
        keys: [
          'numPizzas',
          'ballWeight',
          'yeastType', // toggle
        ],
      },
      {
        legend: 'Biga Preferences',
        keys: ['bigaHydration', 'bigaTime', 'bigaTemp'],
      },
      {
        legend: 'Dough Preferences',
        keys: [
          'bigaPercent',
          'finalHydration',
          'doughTime',
          'doughTemp',
          'saltPercent',
          'maltPercent',
        ],
      },
    ],
    []
  );

  const SCHEDULE_GROUPS = useMemo(
    () => [
      {
        legend: 'Biga Prep / Fermentation',
        keys: ['bigaPrepTime', 'bigaRisingTime'],
      },
      {
        legend: 'Dough Autolyze / Prepare / Proofing',
        keys: [
          'autolyzeRefreshPrep',
          'autolyzeRefreshRest',
          'doughPrepTime',
          'doughRisingTime',
        ],
      },
      {
        legend: 'Dough Ball Prep / Proofing',
        keys: ['ballsPrepTime', 'ballsRisingTime'],
      },
      {
        legend: 'Pre-heat Oven / Food Prep',
        keys: ['preheatOvenDuration', 'toppingsPrepTime'],
      },
    ],
    []
  );

  /* ----------------------------- Actions ----------------------------- */

  const onSave = async () => {
    try {
      await save('doughDefaults', dough);
      await save('scheduleDefaults', sched);
      toast.success('Saved your defaults!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save defaults.');
    }
  };

  const onRestoreSystem = async () => {
    try {
      setRestoring(true);
      const ui = await reset();
      // optional immediate UI sync:
      // setDough(ui.doughDefaults);
      // setSched(ui.scheduleDefaults);
      if (ui?.doughDefaults) setDough(ui.doughDefaults);
      if (ui?.scheduleDefaults) setSched(ui.scheduleDefaults);
      toast.success('Restored to system defaults');
    } catch (err) {
      console.error(err);
      toast.error('Failed to restore defaults');
    } finally {
      setRestoring(false);
    }
  };

  const onApplyToCurrentRecipe = () => {
    setFormData({ ...dough });
    setScheduleData({ ...sched });
    toast.success('Applied to current recipe');
  };

  /* ----------------------------- Render ----------------------------- */

  return (
    <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
      {/* Dough card */}
      <GroupCard title="Dough Defaults">
        {/* md = tablet and up */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* LEFT COLUMN (stacked) */}
          <div className="space-y-6">
            <SubFieldset legend="My Pizza Preferences">
              <RenderSubGroup
                keys={['numPizzas', 'ballWeight', 'yeastType']}
                state={dough}
                setState={setDough}
                size="xs"
                inputClassName="items-start"
              />
            </SubFieldset>

            <SubFieldset legend="Biga Preferences">
              <RenderSubGroup
                keys={['bigaHydration', 'bigaTime', 'bigaTemp']}
                state={dough}
                setState={setDough}
                size="xs"
                inputClassName="items-start"
              />
            </SubFieldset>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <SubFieldset legend="Dough Preferences">
              <RenderSubGroup
                keys={[
                  'bigaPercent',
                  'finalHydration',
                  'doughTime',
                  'doughTemp',
                  'saltPercent',
                  'maltPercent',
                ]}
                state={dough}
                setState={setDough}
                size="xs"
                inputClassName="items-start"
              />
            </SubFieldset>
          </div>
        </div>
      </GroupCard>

      {/* Schedule card */}
      <GroupCard title="Schedule Defaults">
        <TwoColFieldsets
          groups={SCHEDULE_GROUPS}
          state={sched}
          setState={setSched}
          size="xs"
        />
        {/* {SCHEDULE_GROUPS.map((g) => (
          <SubFieldset key={g.legend} legend={g.legend}>
            <RenderSubGroup
              keys={g.keys}
              state={sched}
              setState={setSched}
              size="xs"
            />
          </SubFieldset>
        ))} */}
      </GroupCard>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          aria-busy={saving ? 'true' : 'false'}
          className={`px-3 py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700
              inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {saving && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              role="status"
              aria-label="Saving"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {saving ? 'Saving…' : 'Save My Defaults'}
        </button>

        <button
          type="button"
          onClick={onRestoreSystem}
          disabled={busy}
          aria-busy={restoring ? 'true' : 'false'}
          className={`px-3 py-1 rounded-xl border border-stone-300 dark:border-stone-600
              bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700
              inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {restoring && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              role="status"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {restoring ? 'Restoring…' : 'Restore System Defaults'}
        </button>

        {/* <button
          className="px-3 py-1 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700"
          onClick={onApplyToCurrentRecipe}
        >
          Apply to Current Recipe
        </button> */}
      </div>
    </div>
  );
}
