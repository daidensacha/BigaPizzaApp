// src/components/recipes/ModalRecipeEditor.jsx
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  defaultFormData,
  defaultScheduleData,
} from '@/constants/defaultInputSettings';
import { getRecipeById, updateRecipe } from '@/services/recipeService'; // adjust names if different

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

export default function ModalRecipeEditor({
  mode = 'create',
  recipeId,
  onClose,
}) {
  const { user } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation || null; // App.inner?
  const dialogRef = useRef(null);

  const { formData, setFormData, scheduleData, setScheduleData } = useRecipe();
  const { defaults, save, saving } = useDefaults();

  const [tab, setTab] = useState('dough'); // dough | schedule | preview
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { id: routeId } = useParams();
  const effectiveRecipeId = recipeId || routeId;

  const close = useCallback(() => {
    if (onClose) return onClose(); // caller-provided close (if any)
    if (background) return nav(-1); // routed modal → go back to the background page
    return nav('/'); // direct visit → send somewhere sensible
  }, [nav, onClose, background]);

  // CREATE → seed defaults, no fetch
  useEffect(() => {
    if (mode !== 'create') return;
    setFormData(defaultFormData);
    setScheduleData({ ...defaultScheduleData });
  }, [mode, setFormData, setScheduleData]);

  // CREATE → seed defaults, no fetch
  useEffect(() => {
    if (mode !== 'create') return;
    setFormData(defaultFormData);
    setScheduleData({ ...defaultScheduleData });
  }, [mode, setFormData, setScheduleData]);

  // EDIT → fetch by id
  useEffect(() => {
    if (mode !== 'edit' || !effectiveRecipeId) return;
    let cancelled = false;
    (async () => {
      try {
        const recipe = await getRecipeById(effectiveRecipeId, user?.token);
        if (cancelled) return;
        setFormData(recipe.formData || defaultFormData);
        setScheduleData(recipe.scheduleData || defaultScheduleData);
      } catch (err) {
        console.error('[ModalRecipeEditor] load recipe error:', err);
        toast.error('Failed to load recipe');
        close();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    mode,
    effectiveRecipeId,
    user?.token,
    setFormData,
    setScheduleData,
    close,
  ]);

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

      if (mode === 'edit' && effectiveRecipeId) {
        // UPDATE existing
        const updated = await updateRecipe(
          effectiveRecipeId,
          payload,
          user?.token
        );

        // notify listeners (details page, lists) that this recipe changed
        window.dispatchEvent(
          new CustomEvent('recipe:updated', {
            detail: { id: effectiveRecipeId, recipe: updated },
          })
        );

        toast.success('Recipe updated!');
        // keep context in sync
        setFormData(updated?.formData || formData);
        setScheduleData(updated?.scheduleData || scheduleData);

        // go back to detail page
        nav(`/account/recipes/${effectiveRecipeId}`, { replace: true });
      } else {
        // CREATE new
        const created = await saveRecipe(payload, user?.token);

        if (created?._id) {
          // notify listeners for brand new recipe
          window.dispatchEvent(
            new CustomEvent('recipe:updated', {
              detail: { id: created._id, recipe: created },
            })
          );

          toast.success('Recipe saved successfully!');
          nav(`/account/recipes/${created._id}`, { replace: true });
        } else {
          toast.success('Recipe saved successfully!');
          nav('/account/recipes', { replace: true });
        }
      }
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

  const labelFor = (key) =>
    `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())} (${
      inputConfig[key].unit
    })`;

  // Group keys by phase so we can render fieldsets in order
  const SCHEDULE_GROUPS = [
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
  ];

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl rounded-2xl shadow-xl
bg-white/95 dark:bg-stone-800/95
text-stone-900 dark:text-stone-100
border border-stone-200/70 dark:border-stone-700
h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-auto outline-none"
      >
        {/* Header */}
        <header
          className="sticky top-0 z-10 bg-white/90 dark:bg-stone-800/90 backdrop-blur
border-b border-stone-200 dark:border-stone-700
px-5 py-3 flex items-center justify-between"
        >
          <h2 className="text-base sm:text-lg font-semibold">
            {mode === 'create' ? 'New Recipe' : 'Edit Recipe'}
          </h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-xl font-medium
bg-white dark:bg-stone-800
text-stone-700 dark:text-stone-200
border border-stone-300 dark:border-stone-600
hover:bg-stone-100 dark:hover:bg-stone-700 transition"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded-xl font-semibold
bg-emerald-600 text-white hover:bg-emerald-700
focus:outline-none focus:ring-2 focus:ring-emerald-400
focus:ring-offset-2 dark:focus:ring-offset-stone-800
disabled:opacity-60 disabled:cursor-not-allowed transition"
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
              className={`px-3 py-1 rounded-t-lg border-b-2 transition ${
                tab === t
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 border-emerald-500'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-transparent hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        {/* Content */}
        <section className="px-4 py-6 space-y-6">
          {tab === 'dough' && (
            <>
              <fieldset className="rounded-xl p-4 space-y-4 border border-stone-200/70 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900">
                <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-400">
                  Pizza Basics
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={inputConfig.numPizzas.label}
                    value={formData.numPizzas}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, numPizzas: v }))
                    }
                    {...inputConfig.numPizzas}
                  />
                  <NumberInputGroup
                    label={inputConfig.ballWeight.label}
                    value={formData.ballWeight}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, ballWeight: v }))
                    }
                    {...inputConfig.ballWeight}
                  />
                  <NumberInputGroup
                    label={inputConfig.bigaPercent.label}
                    value={formData.bigaPercent}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bigaPercent: v }))
                    }
                    {...inputConfig.bigaPercent}
                  />
                  <NumberInputGroup
                    label={inputConfig.bigaHydration.label}
                    value={formData.bigaHydration}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bigaHydration: v }))
                    }
                    {...inputConfig.bigaHydration}
                  />
                  <NumberInputGroup
                    label={inputConfig.finalHydration.label}
                    value={formData.finalHydration}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, finalHydration: v }))
                    }
                    {...inputConfig.finalHydration}
                  />

                  <div className="flex flex-col gap-1 items-center min-w-[11rem] justify-center">
                    <span className="text-xs font-medium text-zinc-600 dark:text-stone-400 text-center">
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
              <fieldset className="rounded-xl p-4 space-y-4 border border-stone-200/70 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900">
                <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-400">
                  Fermentation
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={inputConfig.bigaTime.label}
                    value={formData.bigaTime}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bigaTime: v }))
                    }
                    {...inputConfig.bigaTime}
                  />
                  <NumberInputGroup
                    label={inputConfig.bigaTemp.label}
                    value={formData.bigaTemp}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, bigaTemp: v }))
                    }
                    {...inputConfig.bigaTemp}
                  />
                  <NumberInputGroup
                    label={inputConfig.doughTime.label}
                    value={formData.doughTime}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, doughTime: v }))
                    }
                    {...inputConfig.doughTime}
                  />
                  <NumberInputGroup
                    label={inputConfig.doughTemp.label}
                    value={formData.doughTemp}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, doughTemp: v }))
                    }
                    {...inputConfig.doughTemp}
                  />
                </div>
              </fieldset>
              <fieldset className="rounded-xl p-4 space-y-4 border border-stone-200/70 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900">
                <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-400">
                  Extras
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInputGroup
                    label={inputConfig.saltPercent.label}
                    value={formData.saltPercent}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, saltPercent: v }))
                    }
                    {...inputConfig.saltPercent}
                  />
                  <NumberInputGroup
                    label={inputConfig.maltPercent.label}
                    value={formData.maltPercent}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, maltPercent: v }))
                    }
                    {...inputConfig.maltPercent}
                  />
                </div>
              </fieldset>
            </>
          )}

          {tab === 'schedule' && (
            <>
              <fieldset className="rounded-xl px-4 pb-4 pt-0 space-y-4 border border-stone-200/70 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900">
                <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-400">
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
                    className="h-9 w-full leading-none text-sm px-3
rounded-lg border
border-stone-300 dark:border-stone-600
bg-white dark:bg-stone-700
text-stone-900 dark:text-white
placeholder-stone-400 dark:placeholder-stone-400
focus:outline-none focus:ring-2 focus:ring-emerald-400/60
transition dark:[color-scheme:dark]"
                  />
                </div>
              </fieldset>
              {SCHEDULE_GROUPS.map(({ legend, keys }) => (
                <fieldset
                  key={legend}
                  className="rounded-xl px-4 pb-4 pt-0 space-y-4 border border-stone-200/70 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900"
                >
                  <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-400">
                    {legend}
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {keys.map((key) => (
                      <NumberInputGroup
                        key={key}
                        label={inputConfig[key].label}
                        value={scheduleData[key]}
                        onChange={(v) =>
                          setScheduleData((p) => ({ ...p, [key]: v }))
                        }
                        {...inputConfig[key]}
                      />
                    ))}
                  </div>
                </fieldset>
              ))}
            </>
          )}

          {tab === 'preview' && (
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Ingredient table */}
              <div
                className="rounded-xl p-4 overflow-x-auto
border border-stone-200/70 dark:border-stone-700
bg-stone-50/80 dark:bg-stone-900"
              >
                <h3 className="font-semibold mb-3 text-yellow-600">
                  Ingredient Breakdown
                </h3>

                {!previewCalculated ? (
                  <p className="text-sm text-zinc-500">
                    Adjust inputs to see the breakdown.
                  </p>
                ) : (
                  <>
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-300 dark:border-zinc-700 dark:text-stone-400">
                          <th className="text-left py-1 pr-4 ">Ingredient</th>
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
                            <td className="py-1 pr-4 dark:text-stone-400">
                              {row.label}
                            </td>
                            <td className="text-right px-2 dark:text-stone-300">
                              {row.biga}
                            </td>
                            <td className="text-right px-2 dark:text-stone-300">
                              {row.refresh}
                            </td>
                            <td className="text-right px-2 dark:text-stone-300">
                              {row.total}
                            </td>
                            <td className="text-right px-2 dark:text-stone-300">
                              {row.bakers}
                            </td>
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
              <div
                className="rounded-xl p-4
border border-stone-200/70 dark:border-stone-700
bg-stone-50/80 dark:bg-stone-900"
              >
                <h3 className="font-semibold mb-2 text-yellow-600">
                  Prep Timeline
                </h3>
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
                        <span className="dark:text-stone-400">{s.label}</span>
                        <span className="dark:text-stone-300">
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
                className="px-3 py-1 rounded-xl
bg-white dark:bg-stone-800
text-stone-700 dark:text-stone-200
border border-stone-300 dark:border-stone-600
hover:bg-stone-100 dark:hover:bg-stone-700 transition"
                onClick={applyMyDefaults}
              >
                Apply My Defaults
              </button>
              <button
                className="px-3 py-1 rounded-xl
bg-white dark:bg-stone-800
text-stone-700 dark:text-stone-200
border border-stone-300 dark:border-stone-600
hover:bg-stone-100 dark:hover:bg-stone-700 transition"
                disabled={saving}
                onClick={saveTheseAsMyDefaults}
              >
                {saving ? 'Saving…' : 'Save These as My Defaults…'}
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-stone-600 dark:text-stone-400">
            Changes here affect <strong>this recipe only</strong>. Manage your
            saved defaults in <em>Dashboard → Settings</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
