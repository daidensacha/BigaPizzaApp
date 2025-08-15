import { useEffect, useMemo, useState } from 'react';
import { useDefaults } from '@/context/DefaultsContext';
import inputConfig from '@/constants/inputConfig';
import {
  mapDoughDefaultsToForm,
  mapScheduleDefaultsToState,
} from '@/utils/mappers';
import {
  mapFormToDoughDefaults,
  mapStateToScheduleDefaults,
} from '@/utils/mappersInverse';
import {
  defaultFormData,
  defaultScheduleData,
} from '@/constants/defaultInputSettings';
import NumberInputGroup from '@/components/ui/NumberInputGroup';
import { toast } from 'react-hot-toast';
import { useRecipe } from '@/context/RecipeContext';

export default function UserDefaults() {
  const { defaults, save, saving } = useDefaults();
  const { setFormData, setScheduleData } = useRecipe();

  // local editable copies (start from user defaults if present; else system)
  const [dough, setDough] = useState(() =>
    defaults?.doughDefaults
      ? mapDoughDefaultsToForm(defaults.doughDefaults)
      : { ...defaultFormData }
  );
  const [sched, setSched] = useState(() =>
    defaults?.scheduleDefaults
      ? mapScheduleDefaultsToState(defaults.scheduleDefaults)
      : { ...defaultScheduleData }
  );

  // if defaults load later, sync once
  useEffect(() => {
    if (!defaults) return;
    setDough(mapDoughDefaultsToForm(defaults.doughDefaults));
    setSched(mapScheduleDefaultsToState(defaults.scheduleDefaults));
  }, [defaults]);

  const DOUGH_KEYS = useMemo(
    () => [
      'numPizzas',
      'ballWeight',
      'bigaPercent',
      'bigaHydration',
      'finalHydration',
      'bigaTime',
      'bigaTemp',
      'doughTime',
      'doughTemp',
      'saltPercent',
      'maltPercent',
    ],
    []
  );

  const SCHED_KEYS = useMemo(
    () => [
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
    ],
    []
  );

  const onSave = async () => {
    try {
      await save('doughDefaults', mapFormToDoughDefaults(dough));
      await save('scheduleDefaults', mapStateToScheduleDefaults(sched));
      toast.success('Saved your defaults!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save defaults.');
    }
  };

  const onRestoreSystem = () => {
    setDough({ ...defaultFormData });
    setSched({ ...defaultScheduleData });
    toast('Restored to system defaults');
  };

  const onApplyToCurrentRecipe = () => {
    setFormData({ ...dough });
    setScheduleData({ ...sched });
    toast.success('Applied to current recipe');
  };

  return (
    <div className="space-y-6">
      {/* Dough */}
      <fieldset className="rounded-xl p-4 border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900">
        <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-300">
          Dough Defaults
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOUGH_KEYS.map((key) => (
            <NumberInputGroup
              key={key}
              label={inputConfig[key].label}
              value={dough[key]}
              onChange={(v) => setDough((p) => ({ ...p, [key]: v }))}
              {...inputConfig[key]}
            />
          ))}
        </div>
      </fieldset>

      {/* Schedule */}
      <fieldset className="rounded-xl p-4 border border-stone-200/70 dark:border-stone-700 bg-white/80 dark:bg-stone-900">
        <legend className="px-2 text-sm font-semibold text-yellow-700 dark:text-stone-300">
          Schedule Defaults
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCHED_KEYS.map((key) => (
            <NumberInputGroup
              key={key}
              label={inputConfig[key].label}
              value={sched[key]}
              onChange={(v) => setSched((p) => ({ ...p, [key]: v }))}
              {...inputConfig[key]}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save My Defaults'}
        </button>

        <button
          className="px-3 py-1 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700"
          onClick={onRestoreSystem}
        >
          Restore System Defaults
        </button>

        <button
          className="px-3 py-1 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700"
          onClick={onApplyToCurrentRecipe}
        >
          Apply to Current Recipe
        </button>
      </div>
    </div>
  );
}
