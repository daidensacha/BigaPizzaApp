import { getLocalDateTimePlus24h } from '@/utils/dayjsConfig';
import { YEAST_CORRECTION_DEFAULTS } from '@utils/utils';

export const defaultFormData = {
  numPizzas: 6,
  ballWeight: 280,
  bigaPercent: 50, // Biga percentage in fianl dough
  bigaHydration: 50, // Biga hydration
  finalHydration: 68, // Dough hydration
  saltPercent: 3.4, // only in dough refresh
  maltPercent: 0.5, // only in dough refresh
  bigaTime: 24, // Fermentation duration
  bigaTemp: 6, // Fermentation tempurature
  doughTime: 6, // Bulk Fermentation duration
  doughTemp: 22, // Fermentation tempurature
  yeastType: 'idy', // Options: [idy, ady, fresh]
  shortCorrection: YEAST_CORRECTION_DEFAULTS.short, // Adjusts the quantity of yeast in Refresh/ Dough
  longCorrection: YEAST_CORRECTION_DEFAULTS.long, // Adjusts the quantity of yeast in the Biga
};

export const defaultScheduleData = {
  bakingDateTime: getLocalDateTimePlus24h(), // baking date and time default -> [Now + 1 day]
  bigaPrepTime: 15, // minutes  | prepare biga duration
  bigaRisingTime: 24, // hours    | biga fermentation duration
  autolyzeRefreshPrep: 20, // minutes  | prepare autolyze duration
  autolyzeRefreshRest: 30, // minutes  | rest autolyze duration
  doughPrepTime: 30, // minutes  | prepare dough duration
  doughRisingTime: 6, // hours    | dough bulk fermenation duration
  ballsPrepTime: 20, // minutes  | prepare dough balls duration
  ballsRisingTime: 6, // hours    | balls proofing/ rising duration
  preheatOvenDuration: 60, // minutes  | preheat oven duration
  toppingsPrepTime: 30, // minutes  | prepare pizza toppings duration
};
