// src/utils/mappers.js
import {
  defaultFormData,
  defaultScheduleData,
} from '@/constants/defaultInputSettings';

// Normalize backend yeast → UI’s lowercase convention
function normalizeYeastToForm(val) {
  if (!val) return 'idy';
  const v = String(val).toLowerCase();
  if (v.includes('fresh')) return 'fresh';
  if (v.includes('ady')) return 'ady';
  return 'idy';
}

// Map backend doughDefaults ➜ UI formData, then layer system defaults
export function mapDoughDefaultsToForm(d) {
  if (!d) return { ...defaultFormData };
  const mapped = {
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
    yeastType: normalizeYeastToForm(d.yeastType),
  };
  return { ...defaultFormData, ...mapped };
}

// Map backend scheduleDefaults (minutes) ➜ UI scheduleData (hours where needed),
// then layer system defaults (ensuring bakingDateTime default exists)
export function mapScheduleDefaultsToState(s) {
  if (!s) return { ...defaultScheduleData };
  const mapped = {
    bigaPrepTime: s.bigaPrepTimeMin, // minutes
    bigaRisingTime: Math.round((s.bigaRisingTimeMin ?? 0) / 60), // hours
    autolyzeRefreshPrep: s.autolyzeRefreshPrepMin, // minutes
    autolyzeRefreshRest: s.autolyzeRefreshRestMin, // minutes
    doughPrepTime: s.doughPrepTimeMin, // minutes
    doughRisingTime: Math.round((s.doughRisingTimeMin ?? 0) / 60), // hours
    ballsPrepTime: s.ballsPrepTimeMin, // minutes
    ballsRisingTime: Math.round((s.ballsRisingTimeMin ?? 0) / 60), // hours
    preheatOvenDuration: s.preheatOvenDurationMin, // minutes
    toppingsPrepTime: s.toppingsPrepTimeMin, // minutes
  };
  return {
    ...defaultScheduleData,
    ...mapped,
    bakingDateTime: s.bakingDateTime ?? defaultScheduleData.bakingDateTime,
  };
}
