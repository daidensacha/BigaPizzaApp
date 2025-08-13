// src/components/recipes/ModalRecipeEditor.jsx
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { formatLocalLabel } from '@/utils/dayjsConfig';

import { useAuth } from '@/context/AuthContext';
import { useRecipe } from '@/context/RecipeContext';
import { useDefaults } from '@/context/DefaultsContext';

import NumberInputGroup from '@/components/ui/NumberInputGroup';
import YeastTypeToggleGroup from '@/components/ui/YeastTypeToggleGroup';
import YeastCorrectionSliders from '@/components/ui/YeastCorrectionSliders';
import { YEAST_CORRECTION_DEFAULTS } from '@/utils/utils';
import inputConfig from '@/constants/inputConfig';

import { saveRecipe } from '@/services/recipeService';
import { generateRecipeTitle } from '@/utils/recipeFormatting';

import {
  mapDoughDefaultsToForm,
  mapScheduleDefaultsToState,
} from '@/utils/mappers';
import {
  mapFormToDoughDefaults,
  mapStateToScheduleDefaults,
} from '@/utils/mappersInverse';

import {
  calcDoughAndSchedule,
  buildCalculatedData,
  makeIngredientRows,
} from '@/utils/recipeCalcHelpers';

export default function ModalRecipeEditor({ mode = 'create', onClose }) {
  const { user } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation || null;
  const dialogRef = useRef(null);

  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const { defaults, save, saving } = useDefaults();

  const [tab, setTab] = useState('dough'); // dough | schedule | preview
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // a11y + close handlers
  // const close = useCallback(
  //   () => (onClose ? onClose() : nav(-1)),
  //   [nav, onClose]
  // );
  const close = useCallback(() => {
    if (onClose) return onClose(); // caller-provided close (if any)
    if (background) return nav(-1); // routed modal → go back to the background page
    return nav('/'); // direct visit → send somewhere sensible
  }, [nav, onClose, background]);

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

  // Ensure a default bakingDateTime in "create" mode (once)
  useEffect(() => {
    if (mode !== 'create') return;
    setScheduleData((prev) => {
      if (prev?.bakingDateTime && String(prev.bakingDateTime).trim())
        return prev;
      return {
        ...prev,
        bakingDateTime: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
      };
    });
  }, [mode, setScheduleData]);

  // Defaults actions
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
    await save('doughDefaults', mapFormToDoughDefaults(formData));
    await save('scheduleDefaults', mapStateToScheduleDefaults(scheduleData));
  };

  // Single source of truth for calculations (used by preview and save)
  const { results, sched } = useMemo(() => {
    try {
      return calcDoughAndSchedule(formData, scheduleData);
    } catch {
      return { results: null, sched: null };
    }
  }, [formData, scheduleData]);

  const previewCalculated = useMemo(() => {
    try {
      return buildCalculatedData(results, sched, scheduleData);
    } catch {
      return null;
    }
  }, [results, sched, scheduleData]);

  const ingredientRows = useMemo(
    () => makeIngredientRows(previewCalculated),
    [previewCalculated]
  );

  // Save
  const onSaveRecipe = async () => {
    setSavingRecipe(true);
    setSaveError(null);
    try {
      if (!results) throw new Error('Ingredients could not be calculated.');

      const calculatedData = buildCalculatedData(results, sched, scheduleData);
      if (!calculatedData)
        throw new Error('Ingredients could not be calculated.');

      const title = generateRecipeTitle(formData, scheduleData);

      const payload = {
        meta: { version: 1 },
        title,
        formData,
        scheduleData,
        calculatedData,
        notes: '',
        rating: null,
      };
      console.log(
        '[ModalRecipeEditor] Sending payload:',
        JSON.stringify(payload, null, 2)
      );
      const created = await saveRecipe(payload, user?.token);
      toast.success('Recipe saved successfully!');

      if (created?._id) nav(`/recipes/${created._id}`, { replace: true });
      else nav('/recipes', { replace: true });
    } catch (err) {
      console.error('[ModalRecipeEditor] save error:', err);
      setSaveError(err.message || 'Save failed.');
      toast.error('Save failed.');
    } finally {
      setSavingRecipe(false);
    }
  };

  const handleCorrectionChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      ...(name === 'short'
        ? { shortCorrection: value }
        : { longCorrection: value }),
    }));
  };

  const handleResetCorrections = () => {
    setFormData((prev) => ({
      ...prev,
      shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
      longCorrection: YEAST_CORRECTION_DEFAULTS.long,
    }));
  };

  // UI helpers
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
              className="px-3 py-1 rounded bg-black text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onSaveRecipe}
              disabled={savingRecipe}
            >
              {savingRecipe ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {saveError && (
          <p className="px-4 text-sm text-red-600 dark:text-red-400 text-right">
            {saveError}
          </p>
        )}

        {/* Tabs */}
        <nav className="px-4 pt-3 flex gap-2">
          {['dough', 'schedule', 'preview'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${
                tab === t
                  ? 'bg-black text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        {/* Content */}
        <section className="px-4 py-6 space-y-6">
          {tab === 'dough' && (
            <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-4">
              <legend className="px-2 text-sm font-semibold">
                Pizza Settings
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInputGroup
                  label={`Number of pizzas (${inputConfig.numPizzas.unit})`}
                  value={formData.numPizzas}
                  onChange={(v) => setFormData((p) => ({ ...p, numPizzas: v }))}
                  {...inputConfig.numPizzas}
                />
                <NumberInputGroup
                  label={`Ball weight (${inputConfig.ballWeight.unit})`}
                  value={formData.ballWeight}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, ballWeight: v }))
                  }
                  {...inputConfig.ballWeight}
                />
                <NumberInputGroup
                  label={`Dough Biga (${inputConfig.bigaPercent.unit})`}
                  value={formData.bigaPercent}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, bigaPercent: v }))
                  }
                  {...inputConfig.bigaPercent}
                />
                <NumberInputGroup
                  label={`Biga Hydration (${inputConfig.bigaHydration.unit})`}
                  value={formData.bigaHydration}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, bigaHydration: v }))
                  }
                  {...inputConfig.bigaHydration}
                />
                <NumberInputGroup
                  label={`Final Hydration (${inputConfig.finalHydration.unit})`}
                  value={formData.finalHydration}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, finalHydration: v }))
                  }
                  {...inputConfig.finalHydration}
                />

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

              <legend className="px-2 text-sm font-semibold">
                Fermentation
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInputGroup
                  label={`Biga Time (${inputConfig.bigaTime.unit})`}
                  value={formData.bigaTime}
                  onChange={(v) => setFormData((p) => ({ ...p, bigaTime: v }))}
                  {...inputConfig.bigaTime}
                />
                <NumberInputGroup
                  label={`Biga Temp (${inputConfig.bigaTemp.unit})`}
                  value={formData.bigaTemp}
                  onChange={(v) => setFormData((p) => ({ ...p, bigaTemp: v }))}
                  {...inputConfig.bigaTemp}
                />
                <NumberInputGroup
                  label={`Dough Time (${inputConfig.doughTime.unit})`}
                  value={formData.doughTime}
                  onChange={(v) => setFormData((p) => ({ ...p, doughTime: v }))}
                  {...inputConfig.doughTime}
                />
                <NumberInputGroup
                  label={`Dough Temp (${inputConfig.doughTemp.unit})`}
                  value={formData.doughTemp}
                  onChange={(v) => setFormData((p) => ({ ...p, doughTemp: v }))}
                  {...inputConfig.doughTemp}
                />
              </div>

              <legend className="px-2 text-sm font-semibold">Extras</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInputGroup
                  label={`Salt Percent (${inputConfig.saltPercent.unit})`}
                  value={formData.saltPercent}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, saltPercent: v }))
                  }
                  {...inputConfig.saltPercent}
                />
                <NumberInputGroup
                  label={`Malt Percent (${inputConfig.maltPercent.unit})`}
                  value={formData.maltPercent}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, maltPercent: v }))
                  }
                  {...inputConfig.maltPercent}
                />
              </div>
            </fieldset>
          )}

          {tab === 'schedule' && (
            <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-4">
              <legend className="px-2 text-sm font-semibold">
                Baking Date & Time
              </legend>
              <div className="w-full max-w-xs">
                <input
                  type="datetime-local"
                  value={scheduleData.bakingDateTime || nowPlus1Hour}
                  min={dayjs().format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) =>
                    setScheduleData((prev) => ({
                      ...prev,
                      bakingDateTime: e.target.value,
                    }))
                  }
                  className="h-9 w-full dark leading-none text-sm px-3 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 dark:[color-scheme:dark]"
                />
              </div>

              <legend className="px-2 text-sm font-semibold">Schedule</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
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
                ].map((key) => (
                  <NumberInputGroup
                    key={key}
                    label={`${key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (c) => c.toUpperCase())} (${
                      inputConfig[key].unit
                    })`}
                    value={scheduleData[key]}
                    onChange={(v) =>
                      setScheduleData((p) => ({ ...p, [key]: v }))
                    }
                    {...inputConfig[key]}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {tab === 'preview' && (
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Ingredient table */}
              <div className="border rounded-lg p-4 border-zinc-200 dark:border-zinc-800 overflow-x-auto">
                <h3 className="font-semibold mb-3">Ingredient Breakdown</h3>

                {!previewCalculated ? (
                  <p className="text-sm text-zinc-500">
                    Adjust inputs to see the breakdown.
                  </p>
                ) : (
                  <>
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-300 dark:border-zinc-700">
                          <th className="text-left py-1 pr-4">Ingredient</th>
                          <th className="text-right px-2">Biga</th>
                          <th className="text-right px-2">Refresh</th>
                          <th className="text-right px-2">Total</th>
                          <th className="text-right px-2">Baker%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ingredientRows.map((row) => (
                          <tr
                            key={row.label}
                            className="border-b last:border-0 border-zinc-200 dark:border-zinc-800"
                          >
                            <td className="py-1 pr-4">{row.label}</td>
                            <td className="text-right px-2">{row.biga}</td>
                            <td className="text-right px-2">{row.refresh}</td>
                            <td className="text-right px-2">{row.total}</td>
                            <td className="text-right px-2">{row.bakers}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Advanced toggle + compact sliders */}
                    <div className="mt-3">
                      <button
                        type="button"
                        className="text-xs underline text-zinc-800 dark:text-zinc-200"
                        onClick={() => setShowAdvanced((v) => !v)}
                      >
                        {showAdvanced ? 'Hide Advanced' : 'Advanced ▸'}
                      </button>

                      {showAdvanced && (
                        <YeastCorrectionSliders
                          shortValue={formData.shortCorrection}
                          longValue={formData.longCorrection}
                          onChange={handleCorrectionChange}
                          onReset={handleResetCorrections}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Timeline */}
              <div className="border rounded-lg p-4 border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold mb-2">Prep Timeline</h3>
                {!previewCalculated ? (
                  <p className="text-sm text-zinc-500">
                    Set baking date/time to see the timeline.
                  </p>
                ) : (
                  <ol className="space-y-2 text-sm">
                    {previewCalculated.timelineSteps.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-3"
                      >
                        <span>{s.label}</span>
                        <span className="text-zinc-500">
                          {s.time ? formatLocalLabel(s.time) : '—'}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          )}

          {/* Advanced actions */}
          {tab === 'preview' && (
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
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Changes here affect <strong>this recipe only</strong>. Manage your
            saved defaults in <em>Dashboard → Settings</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
