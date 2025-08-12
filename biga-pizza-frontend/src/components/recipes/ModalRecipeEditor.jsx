import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '@/context/RecipeContext';
import { useDefaults } from '@/context/DefaultsContext';
import {
  mapDoughDefaultsToForm,
  mapScheduleDefaultsToState,
} from '@/utils/mappers';
import {
  mapFormToDoughDefaults,
  mapStateToScheduleDefaults,
} from '@/utils/mappersInverse';
import NumberInputGroup from '@components/ui/NumberInputGroup';
import inputConfig from '@/constants/inputConfig';

export default function ModalRecipeEditor({ mode = 'create', onClose }) {
  const nav = useNavigate();
  const dialogRef = useRef(null);
  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const { defaults, save, saving } = useDefaults();

  const [tab, setTab] = useState('dough'); // 'dough' | 'schedule'
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ModalRecipeEditor.jsx (top of file)
  const pizzaSettings = [
    'numPizzas',
    'ballWeight',
    'bigaPercent',
    'bigaHydration',
  ];
  const fermentationSettings = [
    'bigaTime',
    'bigaTemp',
    'doughTime',
    'doughTemp',
    'finalHydration',
    'yeastType',
  ];
  const pizzaExtrasSettings = ['saltPercent', 'maltPercent'];

  const scheduleSettings = [
    'bigaPrepTime',
    'bigaRisingTime',
    'autolyzeRefreshPrep',
    'autolyzeRefreshRest',
    'doughPrepTime',
    'doughRisingTime',
    'ballsPrepTime',
    'ballsRisingTime',
    'preheatOvenDuration',
    'toppingsPrepTime',
  ];

  // utils in ModalRecipeEditor.jsx
  const chunk2 = (arr) =>
    arr.reduce(
      (rows, _, i) => (i % 2 ? rows : [...rows, arr.slice(i, i + 2)]),
      []
    );

  const labelWithUnit = (key, cfg) =>
    cfg?.unit ? `${prettyLabel(key)} (${cfg.unit})` : prettyLabel(key);

  const prettyLabel = (key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

  // Close helpers
  const close = useCallback(() => {
    if (onClose) onClose();
    else nav(-1); // go back if opened via route
  }, [nav, onClose]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // Click outside to close
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  // Focus the dialog on open (a11y)
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Advanced actions
  const applyMyDefaults = () => {
    if (!defaults) return;
    setFormData((prev) => ({
      ...prev,
      ...mapDoughDefaultsToForm(defaults.doughDefaults),
    }));
    setScheduleData((prev) => ({
      ...prev,
      ...mapScheduleDefaultsToState(defaults.scheduleDefaults),
    }));
  };

  const saveTheseAsMyDefaults = async () => {
    const doughPatch = mapFormToDoughDefaults(formData);
    const schedulePatch = mapStateToScheduleDefaults(scheduleData);
    await save('doughDefaults', doughPatch);
    await save('scheduleDefaults', schedulePatch);
    // optionally toast here
  };

  // Demo Save handler (TODO: wire to your recipe save API)
  const onSaveRecipe = async () => {
    // await saveRecipe({ formData, scheduleData, ... })
    close();
  };

  // Tiny field helpers
  const Num = ({ value, onChange, min, max, step = 1 }) => (
    <input
      type="number"
      className="border rounded px-2 py-1 w-full bg-white dark:bg-zinc-900 dark:border-zinc-700"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
  const Field = ({ label, children }) => (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-xs text-zinc-600 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );

  // function RenderDoughGrid({ keys, formData, setFormData }) {
  //   // one stable factory that returns a stable handler per key
  //   const makeChange = useCallback(
  //     (k) => (next) => {
  //       setFormData((prev) =>
  //         prev[k] === next ? prev : { ...prev, [k]: next }
  //       );
  //     },
  //     [setFormData]
  //   );
  //   return (
  //     <div className="space-y-4">
  //       {chunk2(keys).map((pair, rowIdx) => (
  //         <div key={rowIdx} className="w-full flex justify-center gap-6">
  //           {pair.map((key) => {
  //             const cfg = inputConfig[key] || {};

  //             // Select (yeastType)
  //             if (cfg.options) {
  //               return (
  //                 <div
  //                   key={key}
  //                   className="flex flex-col items-center w-[200px]"
  //                 >
  //                   <label className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center">
  //                     {prettyLabel(key)}
  //                   </label>
  //                   <div className="relative w-full">
  //                     <select
  //                       value={formData[key]}
  //                       onChange={(e) =>
  //                         setFormData((prev) => ({
  //                           ...prev,
  //                           [key]: e.target.value,
  //                         }))
  //                       }
  //                       className="h-9 w-full leading-none text-sm px-3 pr-8 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 appearance-none focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
  //                     >
  //                       {cfg.options.map((opt) => (
  //                         <option key={opt} value={opt}>
  //                           {opt.toUpperCase()}
  //                         </option>
  //                       ))}
  //                     </select>
  //                     <svg
  //                       className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
  //                       viewBox="0 0 20 20"
  //                       fill="currentColor"
  //                       aria-hidden="true"
  //                     >
  //                       <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
  //                     </svg>
  //                   </div>
  //                   <div className="text-[10px] text-zinc-500 mt-1">
  //                     {cfg.options.join(', ')}
  //                   </div>
  //                 </div>
  //               );
  //             }

  //             // NumberInputGroup (keeps your working behavior)
  //             return (
  //               <NumberInputGroup
  //                 key={key}
  //                 label={labelWithUnit(key, inputConfig[key])}
  //                 value={formData[key]}
  //                 onChange={(next) =>
  //                   setFormData((prev) => ({ ...prev, [key]: next }))
  //                 }
  //                 {...inputConfig[key]} // <-- use the spread like the working controls
  //                 className="justify-self-center"
  //               />
  //             );
  //           })}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  function RenderDoughGrid({ keys, formData, setFormData }) {
    // one stable factory
    const makeChange = useCallback(
      (field) => (next) => {
        setFormData((prev) =>
          prev[field] === next ? prev : { ...prev, [field]: next }
        );
      },
      [setFormData]
    );

    return (
      <div className="space-y-4">
        {chunk2(keys).map((pair, rowIdx) => (
          <div key={rowIdx} className="w-full flex justify-center gap-6">
            {pair.map((key) => {
              const cfg = inputConfig[key] || {};
              const handleChange = useMemo(
                () => makeChange(key),
                [makeChange, key]
              );

              // select (yeastType)
              if (cfg.options) {
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center w-[200px]"
                  >
                    <label className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center">
                      {prettyLabel(key)}
                    </label>
                    <div className="relative w-full">
                      <select
                        value={formData[key]}
                        onChange={(e) => handleChange(e.target.value)}
                        className="h-9 w-full leading-none text-sm px-3 pr-8 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 appearance-none focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                      >
                        {cfg.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                      </svg>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      {cfg.options.join(', ')}
                    </div>
                  </div>
                );
              }

              // number inputs (unchanged, still spreading inputConfig)
              return (
                <NumberInputGroup
                  key={key}
                  label={labelWithUnit(key, cfg)}
                  value={formData[key]}
                  onChange={handleChange}
                  {...cfg}
                  className="justify-self-center"
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={onBackdropClick}
    >
      {/* Sheet on mobile, dialog on desktop */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="w-full sm:max-w-3xl sm:rounded-2xl sm:shadow-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-auto outline-none modal-recipe-editor"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">
            {mode === 'create' ? 'New Recipe' : 'Edit Recipe'}
          </h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded bg-black text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              onClick={onSaveRecipe}
            >
              Save
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="px-4 pt-3 flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              tab === 'dough'
                ? 'bg-black text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
            onClick={() => setTab('dough')}
          >
            Dough
          </button>
          <button
            className={`px-3 py-1 rounded ${
              tab === 'schedule'
                ? 'bg-black text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
            onClick={() => setTab('schedule')}
          >
            Schedule
          </button>
        </nav>

        {/* Content */}
        <section className="px-4 py-4 space-y-4">
          {tab === 'dough' && (
            <div className="space-y-6">
              <NumberInputGroup
                label={`Number of pizzas (${inputConfig.numPizzas.unit})`}
                value={formData.numPizzas}
                onChange={(next) =>
                  setFormData((p) => ({ ...p, numPizzas: next }))
                }
                {...inputConfig.numPizzas}
              />

              <NumberInputGroup
                label={`Ball weight (${inputConfig.ballWeight.unit})`}
                value={formData.ballWeight}
                onChange={(next) =>
                  setFormData((p) => ({ ...p, ballWeight: next }))
                }
                {...inputConfig.ballWeight}
              />
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Pizza Settings
                </legend>
                <div className="mt-3">
                  <RenderDoughGrid
                    keys={pizzaSettings}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </fieldset>

              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Fermentation
                </legend>
                <div className="mt-3">
                  <RenderDoughGrid
                    keys={fermentationSettings}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </fieldset>

              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Extras
                </legend>
                <div className="mt-3">
                  <RenderDoughGrid
                    keys={pizzaExtrasSettings}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </fieldset>
            </div>
          )}

          {tab === 'schedule' && (
            <>
              <RenderScheduleGrid
                keys={scheduleSettings}
                scheduleData={scheduleData}
                setScheduleData={setScheduleData}
              />
            </>
          )}

          {/* Advanced (readable in dark mode now) */}
          <div className="mt-2">
            <button
              className="text-sm underline text-zinc-800 dark:text-zinc-200"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? 'Hide Advanced' : 'Advanced ▸'}
            </button>
            {showAdvanced && (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
                  onClick={applyMyDefaults}
                >
                  Apply My Defaults
                </button>
                <button
                  className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
                  disabled={saving}
                  onClick={saveTheseAsMyDefaults}
                >
                  {saving ? 'Saving…' : 'Save These as My Defaults…'}
                </button>
              </div>
            )}
          </div>

          {/* Helper note (matches drawer messaging) */}
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Changes here affect <strong>this recipe only</strong>. Manage your
            saved defaults in <em>Dashboard → Settings</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
