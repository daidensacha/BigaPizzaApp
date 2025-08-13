import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { getLocalDateTimePlus24h } from '@utils/dayjsConfig';
import { YEAST_CORRECTION_DEFAULTS } from '@utils/utils';

const RecipeContext = createContext();

const defaultFormData = {
  numPizzas: 3,
  ballWeight: 280,
  bigaHydration: 50,
  finalHydration: 68,
  bigaPercent: 50,
  saltPercent: 3.4, // only in dough refresh
  maltPercent: 0.5, // only in dough refresh
  bigaTime: 24,
  bigaTemp: 6,
  doughTime: 6,
  doughTemp: 22,
  yeastType: 'idy',
  shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
  longCorrection: YEAST_CORRECTION_DEFAULTS.long,
};

const defaultScheduleData = {
  bakingDateTime: getLocalDateTimePlus24h(),
  bigaPrepTime: 15,
  bigaRisingTime: 24, // hours
  autolyzeRefreshPrep: 20,
  autolyzeRefreshRest: 30,
  doughPrepTime: 30,
  doughRisingTime: 6, // hours
  ballsPrepTime: 20,
  ballsRisingTime: 6, // hours
  preheatOvenDuration: 60,
  toppingsPrepTime: 30,
};

export const RecipeProvider = ({ children }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [scheduleData, setScheduleData] = useState(defaultScheduleData);

  const resetFormData = () => setFormData(defaultFormData);
  const resetScheduleData = () => setScheduleData(defaultScheduleData);

  const [isSettingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [isTimelineConfirmed, setTimelineConfirmed] = useState(false);

  // NEW: prevent double seeding per session/mount
  const hasHydratedFromDefaults = useRef(false);

  // NEW: helper to normalize backend yeast to your lowercase
  const normalizeYeast = (val) => {
    if (!val) return 'idy';
    const v = String(val).toLowerCase();
    if (v.includes('fresh')) return 'fresh';
    if (v.includes('ady')) return 'ady';
    return 'idy';
  };

  // NEW: map backend defaults -> current formData keys
  const mapDoughDefaultsToForm = (d) => ({
    numPizzas: d.numberOfPizzas,
    ballWeight: d.ballWeightGrams,
    bigaHydration: d.bigaHydrationPercent,
    finalHydration: d.doughHydrationPercent,
    bigaPercent: d.doughBigaPercent,
    saltPercent: d.saltPercentOfTotalFlour,
    maltPercent: d.maltPercentOfTotalFlour,
    bigaTime: d.bigaFermentationHours,
    bigaTemp: d.bigaFermentationTempC,
    doughTime: d.doughFermentationHours,
    doughTemp: d.doughFermentationTempC,
    yeastType: normalizeYeast(d.yeastType),
    // keep your existing fields
    shortCorrection: YEAST_CORRECTION_DEFAULTS.short,
    longCorrection: YEAST_CORRECTION_DEFAULTS.long,
  });

  // NEW: map backend schedule (minutes) -> your schedule (minutes for prep, HOURS for rising)
  const mapScheduleDefaultsToState = (s) => ({
    bigaPrepTime: s.bigaPrepTimeMin,
    bigaRisingTime: Math.round(s.bigaRisingTimeMin / 60), // -> hours
    autolyzeRefreshPrep: s.autolyzeRefreshPrepMin,
    autolyzeRefreshRest: s.autolyzeRefreshRestMin,
    doughPrepTime: s.doughPrepTimeMin,
    doughRisingTime: Math.round(s.doughRisingTimeMin / 60), // -> hours
    ballsPrepTime: s.ballsPrepTimeMin,
    ballsRisingTime: Math.round(s.ballsRisingTimeMin / 60), // -> hours
    preheatOvenDuration: s.preheatOvenDurationMin,
    toppingsPrepTime: s.toppingsPrepTimeMin,
    bakingDateTime: getLocalDateTimePlus24h(),
  });

  // NEW: public initializer
  const initializeFromDefaults = useCallback((defaults) => {
    if (!defaults || hasHydratedFromDefaults.current) return;

    const { doughDefaults, scheduleDefaults } = defaults;
    console.log('[RecipeContext] Initializing from defaults');
    console.log('Initializing from defaults:', defaults);

    setFormData((prev) => {
      const isPristine = prev === defaultFormData; // reference check
      if (!isPristine) {
        console.log('[RecipeContext] formData not pristine, skip seeding');
        return prev;
      }
      const mapped = mapDoughDefaultsToForm(doughDefaults);
      console.log('[RecipeContext] seeded formData:', mapped);
      return mapped;
    });

    setScheduleData((prev) => {
      const isPristine = prev === defaultScheduleData; // reference check
      if (!isPristine) {
        console.log('[RecipeContext] scheduleData not pristine, skip seeding');
        return prev;
      }
      const mapped = mapScheduleDefaultsToState(scheduleDefaults);
      console.log('[RecipeContext] seeded scheduleData:', mapped);
      return mapped;
    });

    hasHydratedFromDefaults.current = true;
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        formData,
        setFormData,
        resetFormData,
        scheduleData,
        setScheduleData,
        resetScheduleData,
        isSettingsDrawerOpen,
        setSettingsDrawerOpen,
        isTimelineConfirmed,
        setTimelineConfirmed,
        // NEW:
        initializeFromDefaults,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
