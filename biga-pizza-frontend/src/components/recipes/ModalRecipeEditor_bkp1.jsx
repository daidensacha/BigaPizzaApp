import { useEffect, useRef, useState, useCallback } from 'react';
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

  function RenderDoughGrid({ keys, formData, setFormData }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chunk2(keys).map((pair, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pair.map((key) => {
              const cfg = inputConfig[key] || {};
              // For select fields like yeastType
              if (cfg.options) {
                return (
                  <div key={key} className="flex flex-col items-center">
                    <label className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center">
                      {prettyLabel(key)}
                    </label>
                    <select
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="h-8 w-32 text-sm text-center border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                    >
                      {cfg.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              // Number inputs (unit shown in label; no unit pill below)
              return (
                <NumberInputGroup
                  key={key}
                  label={labelWithUnit(key, cfg)}
                  value={formData[key]}
                  onChange={(next) =>
                    setFormData((prev) => ({ ...prev, [key]: next }))
                  }
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
                  className="justify-self-center"
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  function RenderScheduleGrid({ keys, scheduleData, setScheduleData }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chunk2(keys).map((pair, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pair.map((key) => {
              const cfg = inputConfig[key] || {};
              return (
                <NumberInputGroup
                  key={key}
                  label={labelWithUnit(key, cfg)}
                  value={scheduleData[key]}
                  onChange={(next) =>
                    setScheduleData((prev) => ({ ...prev, [key]: next }))
                  }
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
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
        className="w-full sm:max-w-3xl sm:rounded-2xl sm:shadow-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-auto outline-none"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* <Field label="Number of Pizzas"> */}
              <NumberInputGroup
                label="Number of pizzas"
                value={formData.numPizzas}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, numPizzas: next }))
                }
                {...inputConfig.numPizzas}
              />
              {/* </Field> */}
              {/* <Field label="Ball Weight (g)"> */}
              <NumberInputGroup
                label={`Ball weight (${inputConfig.ballWeight.unit})`}
                value={formData.ballWeight}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, ballWeight: next }))
                }
                {...inputConfig.ballWeight}
              />
              {/* </Field> */}
              {/* <Field label="Dough Biga %"> */}
              {/* <Num
                  value={formData.bigaPercent}
                  onChange={(v) => setFormData({ ...formData, bigaPercent: v })}
                  min={40}
                  max={100}
                /> */}
              <NumberInputGroup
                label={`Dough Biga (${inputConfig.bigaPercent.unit})`}
                value={formData.bigaPercent}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, bigaPercent: next }))
                }
                {...inputConfig.bigaPercent}
              />
              {/* </Field> */}
              {/* <Field label="Dough Hydration %"> */}
              {/* <Num
                value={formData.finalHydration}
                onChange={(v) =>
                  setFormData({ ...formData, finalHydration: v })
                }
                min={40}
                max={85}
              /> */}
              <NumberInputGroup
                label={`Dough Hydration (${inputConfig.finalHydration.unit})`}
                value={formData.finalHydration}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, finalHydration: next }))
                }
                {...inputConfig.finalHydration}
              />
              {/* </Field> */}
              {/* <Field label="Biga Hydration %"> */}
              {/* <Num
                  value={formData.bigaHydration}
                  onChange={(v) =>
                    setFormData({ ...formData, bigaHydration: v })
                  }
                  min={35}
                  max={70}
                /> */}
              <NumberInputGroup
                label={`Biga Hydration (${inputConfig.bigaHydration.unit})`}
                value={formData.bigaHydration}
                onChange={(next) =>
                  setFormData((prev) => ({ ...prev, bigaHydration: next }))
                }
                {...inputConfig.bigaHydration}
              />
              {/* </Field> */}
              <Field label="Yeast Type">
                <select
                  className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 dark:border-zinc-700"
                  value={formData.yeastType}
                  onChange={(e) =>
                    setFormData({ ...formData, yeastType: e.target.value })
                  }
                >
                  <option value="idy">IDY</option>
                  <option value="ady">ADY</option>
                  <option value="fresh">FRESH</option>
                </select>
              </Field>

              {/* Fermentation */}
              <div className="sm:col-span-2 grid grid-cols-2 gap-3 border rounded-lg p-3 border-zinc-200 dark:border-zinc-800">
                <Field label="Biga Hours">
                  <Num
                    value={formData.bigaTime}
                    onChange={(v) => setFormData({ ...formData, bigaTime: v })}
                    min={6}
                    max={48}
                  />
                </Field>
                <Field label="Biga Temp (°C)">
                  <Num
                    value={formData.bigaTemp}
                    onChange={(v) => setFormData({ ...formData, bigaTemp: v })}
                    min={4}
                    max={35}
                  />
                </Field>
                <Field label="Dough Hours">
                  <Num
                    value={formData.doughTime}
                    onChange={(v) => setFormData({ ...formData, doughTime: v })}
                    min={4}
                    max={72}
                  />
                </Field>
                <Field label="Dough Temp (°C)">
                  <Num
                    value={formData.doughTemp}
                    onChange={(v) => setFormData({ ...formData, doughTemp: v })}
                    min={4}
                    max={35}
                  />
                </Field>
              </div>
            </div>
          )}

          {tab === 'schedule' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Biga Prep (min)">
                <Num
                  value={scheduleData.bigaPrepTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, bigaPrepTime: v })
                  }
                />
              </Field>
              <Field label="Biga Rising (hours)">
                <Num
                  value={scheduleData.bigaRisingTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, bigaRisingTime: v })
                  }
                />
              </Field>
              <Field label="Autolyze Prep (min)">
                <Num
                  value={scheduleData.autolyzeRefreshPrep}
                  onChange={(v) =>
                    setScheduleData({
                      ...scheduleData,
                      autolyzeRefreshPrep: v,
                    })
                  }
                />
              </Field>
              <Field label="Autolyze Rest (min)">
                <Num
                  value={scheduleData.autolyzeRefreshRest}
                  onChange={(v) =>
                    setScheduleData({
                      ...scheduleData,
                      autolyzeRefreshRest: v,
                    })
                  }
                />
              </Field>
              <Field label="Dough Prep (min)">
                <Num
                  value={scheduleData.doughPrepTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, doughPrepTime: v })
                  }
                />
              </Field>
              <Field label="Dough Rising (hours)">
                <Num
                  value={scheduleData.doughRisingTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, doughRisingTime: v })
                  }
                />
              </Field>
              <Field label="Balls Prep (min)">
                <Num
                  value={scheduleData.ballsPrepTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, ballsPrepTime: v })
                  }
                />
              </Field>
              <Field label="Balls Rising (hours)">
                <Num
                  value={scheduleData.ballsRisingTime}
                  onChange={(v) =>
                    setScheduleData({ ...scheduleData, ballsRisingTime: v })
                  }
                />
              </Field>
              <Field label="Preheat Oven (min)">
                <Num
                  value={scheduleData.preheatOvenDuration}
                  onChange={(v) =>
                    setScheduleData({
                      ...scheduleData,
                      preheatOvenDuration: v,
                    })
                  }
                />
              </Field>
              <Field label="Toppings Prep (min)">
                <Num
                  value={scheduleData.toppingsPrepTime}
                  onChange={(v) =>
                    setScheduleData({
                      ...scheduleData,
                      toppingsPrepTime: v,
                    })
                  }
                />
              </Field>
            </div>
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
