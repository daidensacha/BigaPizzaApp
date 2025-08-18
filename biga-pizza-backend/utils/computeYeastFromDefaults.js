// src/utils/computeYeastFromDefaults.js (server)
import {
  predictYeastPercent,
  YEAST_CORRECTION_DEFAULTS,
} from './yeastPercentUtils.js';
// ^ If your yeast utils live in the client, copy the small bits server-side or move them to a shared folder.

export function computeYeastFromDefaults(dough) {
  // dough = backend shape: numberOfPizzas, ballWeightGrams, doughHydrationPercent, doughBigaPercent, ...
  const {
    doughBigaPercent, // %
    doughHydrationPercent, // %
    bigaHydrationPercent, // %
    yeastType, // 'IDY' | 'ADY' | 'FRESH'
    bigaFermentationHours, // h
    bigaFermentationTempC, // °C
    doughFermentationHours, // h
    doughFermentationTempC, // °C
  } = dough;

  // match your client formula expectations
  const common = {
    yeastType: String(yeastType || 'IDY').toLowerCase(), // 'idy' | 'ady' | 'fresh'
  };

  const bigaYeastPercent = predictYeastPercent({
    stage: 'biga',
    temp: bigaFermentationTempC,
    time: bigaFermentationHours,
    ...common,
    // long-correction for biga per your client default
    correction: YEAST_CORRECTION_DEFAULTS.long,
  });

  const refreshYeastPercent = predictYeastPercent({
    stage: 'refresh',
    temp: doughFermentationTempC,
    time: doughFermentationHours,
    bigaPercent: (doughBigaPercent ?? 0) / 100, // client expects 0–1
    ...common,
    // short/long auto-picked in your function if not passed,
    // but we can be explicit with “short” default
    correction: YEAST_CORRECTION_DEFAULTS.short,
  });

  const round3 = (x) => Number(x.toFixed(3));

  return {
    bigaYeastPercentOfBigaFlour: round3(bigaYeastPercent), // % of flour in the biga
    refreshYeastPercentOfRefreshFlour: round3(refreshYeastPercent), // % of flour in the refresh/final
  };
}
