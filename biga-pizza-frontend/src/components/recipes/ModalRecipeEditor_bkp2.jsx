// src/components/recipes/ModalRecipeEditor.jsx
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

  // ---------- helpers ----------
  const prettyUnitLabel = (key) =>
    inputConfig[key]?.unit ? ` (${inputConfig[key].unit})` : '';

  const close = useCallback(() => {
    if (onClose) onClose();
    else nav(-1);
  }, [nav, onClose]);

  // esc to close
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // click outside to close
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  // focus dialog on open
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
  };

  const onSaveRecipe = async () => {
    // TODO: wire to your save API
    close();
  };

  // ---------- render ----------
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl sm:rounded-2xl sm:shadow-xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-auto outline-none"
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
        <section className="px-4 py-4 space-y-6">
          {tab === 'dough' && (
            <div className="space-y-6">
              {/* Pizza Settings */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Pizza Settings
                </legend>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInputGroup
                    label={`Number of pizzas${prettyUnitLabel('numPizzas')}`}
                    value={formData.numPizzas}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, numPizzas: next }))
                    }
                    {...inputConfig.numPizzas}
                  />

                  <NumberInputGroup
                    label={`Ball weight${prettyUnitLabel('ballWeight')}`}
                    value={formData.ballWeight}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, ballWeight: next }))
                    }
                    {...inputConfig.ballWeight}
                  />

                  <NumberInputGroup
                    label={`Dough Biga${prettyUnitLabel('bigaPercent')}`}
                    value={formData.bigaPercent}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, bigaPercent: next }))
                    }
                    {...inputConfig.bigaPercent}
                  />

                  <NumberInputGroup
                    label={`Dough Hydration${prettyUnitLabel(
                      'finalHydration'
                    )}`}
                    value={formData.finalHydration}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, finalHydration: next }))
                    }
                    {...inputConfig.finalHydration}
                  />

                  <NumberInputGroup
                    label={`Biga Hydration${prettyUnitLabel('bigaHydration')}`}
                    value={formData.bigaHydration}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, bigaHydration: next }))
                    }
                    {...inputConfig.bigaHydration}
                  />

                  {/* Yeast type (select with helper) */}
                  <div className="flex flex-col items-center">
                    <label className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center">
                      Yeast Type
                    </label>
                    <div className="relative">
                      <select
                        value={formData.yeastType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            yeastType: e.target.value,
                          }))
                        }
                        className="
                          h-9 leading-none text-sm px-3 pr-8 min-w-[8rem]
                          border border-zinc-300 rounded-md
                          bg-white dark:bg-zinc-900 dark:border-zinc-700
                          text-zinc-900 dark:text-zinc-100
                          appearance-none
                          focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10
                        "
                      >
                        {inputConfig.yeastType.options.map((opt) => (
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
                      {inputConfig.yeastType.options
                        .map((o) => o.toUpperCase())
                        .join(', ')}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Fermentation */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Fermentation
                </legend>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInputGroup
                    label={`Biga Hours${prettyUnitLabel('bigaTime')}`}
                    value={formData.bigaTime}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, bigaTime: next }))
                    }
                    {...inputConfig.bigaTime}
                  />

                  <NumberInputGroup
                    label={`Biga Temp${prettyUnitLabel('bigaTemp')}`}
                    value={formData.bigaTemp}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, bigaTemp: next }))
                    }
                    {...inputConfig.bigaTemp}
                  />

                  <NumberInputGroup
                    label={`Dough Hours${prettyUnitLabel('doughTime')}`}
                    value={formData.doughTime}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, doughTime: next }))
                    }
                    {...inputConfig.doughTime}
                  />

                  <NumberInputGroup
                    label={`Dough Temp${prettyUnitLabel('doughTemp')}`}
                    value={formData.doughTemp}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, doughTemp: next }))
                    }
                    {...inputConfig.doughTemp}
                  />
                </div>
              </fieldset>

              {/* Extras */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Extras
                </legend>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NumberInputGroup
                    label={`Salt${prettyUnitLabel('saltPercent')}`}
                    value={formData.saltPercent}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, saltPercent: next }))
                    }
                    {...inputConfig.saltPercent}
                  />

                  <NumberInputGroup
                    label={`Malt${prettyUnitLabel('maltPercent')}`}
                    value={formData.maltPercent}
                    onChange={(next) =>
                      setFormData((prev) => ({ ...prev, maltPercent: next }))
                    }
                    {...inputConfig.maltPercent}
                  />
                </div>
              </fieldset>
            </div>
          )}

          {tab === 'schedule' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberInputGroup
                label={`Biga Prep${prettyUnitLabel('bigaPrepTime')}`}
                value={scheduleData.bigaPrepTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({ ...prev, bigaPrepTime: next }))
                }
                {...inputConfig.bigaPrepTime}
              />

              <NumberInputGroup
                label={`Biga Rising${prettyUnitLabel('bigaRisingTime')}`}
                value={scheduleData.bigaRisingTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({ ...prev, bigaRisingTime: next }))
                }
                {...inputConfig.bigaRisingTime}
              />

              <NumberInputGroup
                label={`Autolyze Prep${prettyUnitLabel('autolyzeRefreshPrep')}`}
                value={scheduleData.autolyzeRefreshPrep}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    autolyzeRefreshPrep: next,
                  }))
                }
                {...inputConfig.autolyzeRefreshPrep}
              />

              <NumberInputGroup
                label={`Autolyze Rest${prettyUnitLabel('autolyzeRefreshRest')}`}
                value={scheduleData.autolyzeRefreshRest}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    autolyzeRefreshRest: next,
                  }))
                }
                {...inputConfig.autolyzeRefreshRest}
              />

              <NumberInputGroup
                label={`Dough Prep${prettyUnitLabel('doughPrepTime')}`}
                value={scheduleData.doughPrepTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({ ...prev, doughPrepTime: next }))
                }
                {...inputConfig.doughPrepTime}
              />

              <NumberInputGroup
                label={`Dough Rising${prettyUnitLabel('doughRisingTime')}`}
                value={scheduleData.doughRisingTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    doughRisingTime: next,
                  }))
                }
                {...inputConfig.doughRisingTime}
              />

              <NumberInputGroup
                label={`Balls Prep${prettyUnitLabel('ballsPrepTime')}`}
                value={scheduleData.ballsPrepTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({ ...prev, ballsPrepTime: next }))
                }
                {...inputConfig.ballsPrepTime}
              />

              <NumberInputGroup
                label={`Balls Rising${prettyUnitLabel('ballsRisingTime')}`}
                value={scheduleData.ballsRisingTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    ballsRisingTime: next,
                  }))
                }
                {...inputConfig.ballsRisingTime}
              />

              <NumberInputGroup
                label={`Preheat Oven${prettyUnitLabel('preheatOvenDuration')}`}
                value={scheduleData.preheatOvenDuration}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    preheatOvenDuration: next,
                  }))
                }
                {...inputConfig.preheatOvenDuration}
              />

              <NumberInputGroup
                label={`Toppings Prep${prettyUnitLabel('toppingsPrepTime')}`}
                value={scheduleData.toppingsPrepTime}
                onChange={(next) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    toppingsPrepTime: next,
                  }))
                }
                {...inputConfig.toppingsPrepTime}
              />
            </div>
          )}

          {/* Advanced */}
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

          {/* Helper note */}
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Changes here affect <strong>this recipe only</strong>. Manage your
            saved defaults in <em>Dashboard → Settings</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
