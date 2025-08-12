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
import dayjs from 'dayjs';
import YeastTypeToggleGroup from '@/components/ui/YeastTypeToggleGroup';

export default function ModalRecipeEditor({ mode = 'create', onClose }) {
  const nav = useNavigate();
  const dialogRef = useRef(null);
  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const { defaults, save, saving } = useDefaults();

  const [tab, setTab] = useState('dough'); // 'dough' | 'schedule'
  const [showAdvanced, setShowAdvanced] = useState(false);

  const close = useCallback(() => {
    if (onClose) onClose();
    else nav(-1);
  }, [nav, onClose]);

  // Focus dialog + ESC to close
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  // Advanced
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
    // TODO: wire to your save endpoint if needed
    close();
  };

  // Default for baking time (now + 1h), only as a displayed fallback
  const nowPlus1Hour = dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm');

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
        <section className="px-4 py-6 space-y-6">
          {tab === 'dough' && (
            <div className="space-y-6">
              {/* Pizza Settings */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Pizza Settings
                </legend>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <NumberInputGroup
                    label={`Dough Biga (${inputConfig.bigaPercent.unit})`}
                    value={formData.bigaPercent}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, bigaPercent: next }))
                    }
                    {...inputConfig.bigaPercent}
                  />
                  <NumberInputGroup
                    label={`Biga Hydration (${inputConfig.bigaHydration.unit})`}
                    value={formData.bigaHydration}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, bigaHydration: next }))
                    }
                    {...inputConfig.bigaHydration}
                  />
                  <NumberInputGroup
                    label={`Final Hydration (${inputConfig.finalHydration.unit})`}
                    value={formData.finalHydration}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, finalHydration: next }))
                    }
                    {...inputConfig.finalHydration}
                  />

                  {/* Yeast Type */}
                  <div className="flex flex-col gap-1 items-center min-w-[11rem] justify-center">
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 text-center">
                      Yeast Type
                    </span>
                    <YeastTypeToggleGroup
                      value={formData.yeastType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      theme="dark"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Fermentation */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Fermentation
                </legend>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={`Biga Time (${inputConfig.bigaTime.unit})`}
                    value={formData.bigaTime}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, bigaTime: next }))
                    }
                    {...inputConfig.bigaTime}
                  />
                  <NumberInputGroup
                    label={`Biga Temp (${inputConfig.bigaTemp.unit})`}
                    value={formData.bigaTemp}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, bigaTemp: next }))
                    }
                    {...inputConfig.bigaTemp}
                  />
                  <NumberInputGroup
                    label={`Dough Time (${inputConfig.doughTime.unit})`}
                    value={formData.doughTime}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, doughTime: next }))
                    }
                    {...inputConfig.doughTime}
                  />
                  <NumberInputGroup
                    label={`Dough Temp (${inputConfig.doughTemp.unit})`}
                    value={formData.doughTemp}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, doughTemp: next }))
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
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={`Salt Percent (${inputConfig.saltPercent.unit})`}
                    value={formData.saltPercent}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, saltPercent: next }))
                    }
                    {...inputConfig.saltPercent}
                  />
                  <NumberInputGroup
                    label={`Malt Percent (${inputConfig.maltPercent.unit})`}
                    value={formData.maltPercent}
                    onChange={(next) =>
                      setFormData((p) => ({ ...p, maltPercent: next }))
                    }
                    {...inputConfig.maltPercent}
                  />
                </div>
              </fieldset>
            </div>
          )}

          {tab === 'schedule' && (
            <div className="space-y-6">
              {/* Baking time */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Baking Date & Time
                </legend>
                <div className="mt-3 w-full max-w-xs">
                  <input
                    type="datetime-local"
                    className="h-9 w-full ... dark:[color-scheme:dark]"
                    value={scheduleData.bakingDateTime || nowPlus1Hour}
                    onChange={(e) =>
                      setScheduleData((prev) => ({
                        ...prev,
                        bakingDateTime: e.target.value,
                      }))
                    }
                    min={dayjs().format('YYYY-MM-DDTHH:mm')}
                    className="h-9 w-full leading-none text-sm px-3 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>
              </fieldset>

              {/* Schedule */}
              <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Schedule
                </legend>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={`Biga Prep (${inputConfig.bigaPrepTime.unit})`}
                    value={scheduleData.bigaPrepTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, bigaPrepTime: next }))
                    }
                    {...inputConfig.bigaPrepTime}
                  />
                  <NumberInputGroup
                    label={`Biga Rising (${inputConfig.bigaRisingTime.unit})`}
                    value={scheduleData.bigaRisingTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, bigaRisingTime: next }))
                    }
                    {...inputConfig.bigaRisingTime}
                  />
                  <NumberInputGroup
                    label={`Autolyze Prep (${inputConfig.autolyzeRefreshPrep.unit})`}
                    value={scheduleData.autolyzeRefreshPrep}
                    onChange={(next) =>
                      setScheduleData((p) => ({
                        ...p,
                        autolyzeRefreshPrep: next,
                      }))
                    }
                    {...inputConfig.autolyzeRefreshPrep}
                  />
                  <NumberInputGroup
                    label={`Autolyze Rest (${inputConfig.autolyzeRefreshRest.unit})`}
                    value={scheduleData.autolyzeRefreshRest}
                    onChange={(next) =>
                      setScheduleData((p) => ({
                        ...p,
                        autolyzeRefreshRest: next,
                      }))
                    }
                    {...inputConfig.autolyzeRefreshRest}
                  />
                  <NumberInputGroup
                    label={`Dough Prep (${inputConfig.doughPrepTime.unit})`}
                    value={scheduleData.doughPrepTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, doughPrepTime: next }))
                    }
                    {...inputConfig.doughPrepTime}
                  />
                  <NumberInputGroup
                    label={`Dough Rising (${inputConfig.doughRisingTime.unit})`}
                    value={scheduleData.doughRisingTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, doughRisingTime: next }))
                    }
                    {...inputConfig.doughRisingTime}
                  />
                  <NumberInputGroup
                    label={`Balls Prep (${inputConfig.ballsPrepTime.unit})`}
                    value={scheduleData.ballsPrepTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, ballsPrepTime: next }))
                    }
                    {...inputConfig.ballsPrepTime}
                  />
                  <NumberInputGroup
                    label={`Balls Rising (${inputConfig.ballsRisingTime.unit})`}
                    value={scheduleData.ballsRisingTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, ballsRisingTime: next }))
                    }
                    {...inputConfig.ballsRisingTime}
                  />
                  <NumberInputGroup
                    label={`Preheat Oven (${inputConfig.preheatOvenDuration.unit})`}
                    value={scheduleData.preheatOvenDuration}
                    onChange={(next) =>
                      setScheduleData((p) => ({
                        ...p,
                        preheatOvenDuration: next,
                      }))
                    }
                    {...inputConfig.preheatOvenDuration}
                  />
                  <NumberInputGroup
                    label={`Toppings Prep (${inputConfig.toppingsPrepTime.unit})`}
                    value={scheduleData.toppingsPrepTime}
                    onChange={(next) =>
                      setScheduleData((p) => ({ ...p, toppingsPrepTime: next }))
                    }
                    {...inputConfig.toppingsPrepTime}
                  />
                </div>
              </fieldset>
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

          {/* Note */}
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Changes here affect <strong>this recipe only</strong>. Manage your
            saved defaults in <em>Dashboard → Settings</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
