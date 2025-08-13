import { getLocalDateTimePlus24h } from '@/utils/dayjsConfig';

const inputConfig = {
  // 🍕 Pizza Settings
  bakingDateTime: {
    default: getLocalDateTimePlus24h(),
    type: 'datetime-local',
  },
  numPizzas: {
    default: 3,
    min: 1,
    max: 50,
    step: 1,
    unit: 'pcs',
  },
  ballWeight: {
    default: 280,
    min: 250,
    max: 300,
    step: 1,
    unit: 'g',
  },
  bigaPercent: {
    default: 50,
    min: 20,
    max: 100,
    step: 1,
    unit: '%',
  },
  bigaHydration: {
    default: 50,
    min: 40,
    max: 60,
    step: 1,
    unit: '%',
  },
  finalHydration: {
    // final dough hydration
    default: 50,
    min: 60,
    max: 80,
    step: 1,
    unit: '%',
  },
  bigaTime: {
    default: 24,
    min: 16,
    max: 48,
    step: 1,
    unit: 'h', // hours
  },
  bigaTemp: {
    default: 6,
    min: 4,
    max: 24,
    step: 1,
    unit: '°C',
  },
  doughTime: {
    default: 24,
    min: 5,
    max: 72,
    step: 1,
    unit: 'h', // hours
  },
  doughTemp: {
    default: 22,
    min: 4,
    max: 24,
    step: 1,
    unit: '°C', // celcius
  },
  saltPercent: {
    default: 3,
    min: 2,
    max: 4,
    step: 0.1,
    unit: '%', // grams
  },
  maltPercent: {
    default: 0.05,
    min: 0,
    max: 1,
    step: 0.01,
    unit: '%',
  },
  yeastType: {
    default: 'idy',
    options: ['idy', 'ady', 'fresh'],
  },
  shortCorrection: {
    default: 0,
    step: 0.01,
  },
  longCorrection: {
    default: 0,
    step: 0.01,
  },

  // 🕓 Schedule Settings
  bigaPrepTime: {
    default: 15,
    min: 5,
    max: 30,
    step: 1,
    unit: 'm',
  },
  bigaRisingTime: {
    default: 24,
    min: 16,
    max: 48,
    step: 1,
    unit: 'h',
  },
  autolyzeRefreshPrep: {
    default: 10,
    min: 5,
    max: 20,
    step: 1,
    unit: 'm',
  },
  autolyzeRefreshRest: {
    default: 30,
    min: 0,
    max: 120,
    step: 1,
    unit: 'm',
  },
  doughPrepTime: {
    default: 30,
    min: 5,
    max: 45,
    step: 1,
    unit: 'm',
  },
  doughRisingTime: {
    default: 6,
    min: 1,
    max: 24,
    step: 1,
    unit: 'h',
  },
  ballsPrepTime: {
    default: 20,
    min: 5,
    max: 30,
    step: 1,
    unit: 'm',
  },
  ballsRisingTime: {
    default: 6,
    min: 1,
    max: 24,
    step: 0.5,
    unit: 'h',
  },
  preheatOvenDuration: {
    default: 60,
    min: 30,
    max: 150, // allows for wood fired ovens
    step: 0.5,
    unit: 'm',
  },
  toppingsPrepTime: {
    default: 30,
    min: 10,
    max: 60,
    step: 1,
    unit: 'm',
  },
};

export default inputConfig;
