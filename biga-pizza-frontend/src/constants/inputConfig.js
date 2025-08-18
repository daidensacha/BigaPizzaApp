import { getLocalDateTimePlus24h } from '@/utils/dayjsConfig';
import {
  defaultFormData,
  defaultScheduleData,
} from '@/constants/defaultInputSettings';

const inputConfig = {
  // 🍕 Pizza Settings
  bakingDateTime: {
    default: getLocalDateTimePlus24h(),
    type: 'datetime-local',
  },
  numPizzas: {
    default: defaultFormData.numPizzas,
    min: 1,
    max: 50,
    step: 1,
    unit: 'pcs',
    label: 'Pizzas (pcs)',
  },
  ballWeight: {
    default: defaultFormData.ballWeight,
    min: 200,
    max: 300,
    step: 1,
    unit: 'g',
    label: 'Ball Weight (g)',
  },
  bigaPercent: {
    default: defaultFormData.bigaPercent,
    min: 20,
    max: 100,
    step: 1,
    unit: '%',
    label: 'Biga in Dough (%)',
  },
  bigaHydration: {
    default: defaultFormData.bigaHydration,
    min: 40,
    max: 60,
    step: 1,
    unit: '%',
    label: 'Biga Hydration (%)',
  },
  finalHydration: {
    // final dough hydration
    default: defaultFormData.finalHydration,
    min: 60,
    max: 80,
    step: 1,
    unit: '%',
    label: 'Dough Hydration (%)',
  },
  bigaTime: {
    default: defaultFormData.bigaTime,
    min: 16,
    max: 48,
    step: 1,
    unit: 'h', // hours
    label: 'Biga Duration (h)',
  },
  bigaTemp: {
    default: defaultFormData.bigaTemp,
    min: 4,
    max: 24,
    step: 1,
    unit: '°C',
    label: 'Biga Temp (°C)',
  },
  doughTime: {
    default: defaultFormData.doughTime,
    min: 5,
    max: 72,
    step: 1,
    unit: 'h', // hours
    label: 'Dough Duration (h)',
  },
  doughTemp: {
    default: defaultFormData.doughTemp,
    min: 4,
    max: 24,
    step: 1,
    unit: '°C', // celcius
    label: 'Dough Temp (°C)',
  },
  saltPercent: {
    default: defaultFormData.saltPercent,
    min: 2,
    max: 4,
    step: 0.1,
    unit: '%', // grams
    label: 'Salt (%)',
  },
  maltPercent: {
    default: defaultFormData.maltPercent,
    min: 0,
    max: 1,
    step: 0.01,
    unit: '%',
    label: 'Malt (%) (Optional)',
  },
  yeastType: {
    default: defaultFormData.yeastType,
    options: ['idy', 'ady', 'fresh'],
    label: 'Yeast Type',
  },
  shortCorrection: {
    default: defaultFormData.shortCorrection,
    step: 0.01,
  },
  longCorrection: {
    default: defaultFormData.longCorrection,
    step: 0.01,
  },

  // 🕓 Schedule Settings
  bigaPrepTime: {
    default: defaultScheduleData.bigaPrepTime,
    min: 5,
    max: 30,
    step: 1,
    unit: 'm',
    label: 'Biga Prep (m)',
  },
  bigaRisingTime: {
    default: defaultScheduleData.bigaRisingTime,
    min: 16,
    max: 48,
    step: 1,
    unit: 'h',
    label: 'Biga Fermantation (h)',
  },
  autolyzeRefreshPrep: {
    default: defaultScheduleData.autolyzeRefreshPrep,
    min: 0,
    max: 20,
    step: 1,
    unit: 'm',
    label: 'Autolyze Prep (m)',
  },
  autolyzeRefreshRest: {
    default: defaultScheduleData.autolyzeRefreshRest,
    min: 0,
    max: 120,
    step: 1,
    unit: 'm',
    label: 'Autolyze Rest (m)',
  },
  doughPrepTime: {
    default: defaultScheduleData.doughPrepTime,
    min: 5,
    max: 45,
    step: 1,
    unit: 'm',
    label: 'Dough Prep (m)',
  },
  doughRisingTime: {
    default: defaultScheduleData.doughRisingTime,
    min: 1,
    max: 24,
    step: 1,
    unit: 'h',
    label: 'Dough Proofing (h)',
  },
  ballsPrepTime: {
    default: defaultScheduleData.ballsPrepTime,
    min: 5,
    max: 30,
    step: 1,
    unit: 'm',
    label: 'Balls Prep (m)',
  },
  ballsRisingTime: {
    default: defaultScheduleData.ballsRisingTime,
    min: 1,
    max: 24,
    step: 0.5,
    unit: 'h',
    label: 'Balls Proofing (h)',
  },
  preheatOvenDuration: {
    default: defaultScheduleData.preheatOvenDuration,
    min: 30,
    max: 150, // allows for wood fired ovens
    step: 0.5,
    unit: 'm',
    label: 'Preheat Oven (m)',
  },
  toppingsPrepTime: {
    default: defaultScheduleData.toppingsPrepTime,
    min: 10,
    max: 60,
    step: 1,
    unit: 'm',
    label: 'Prep Toppings (m)',
  },
};

export default inputConfig;
