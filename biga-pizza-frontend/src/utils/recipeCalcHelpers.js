import dayjs from 'dayjs';
import { calculateDough } from '@/utils/utils';
import { calculatePrepSchedule } from '@/utils/scheduleCalculator';
import { formatLocalLabel } from '@/utils/dayjsConfig';
import { round } from '@/utils/utils';

/**
 * Calculate dough + schedule from current state.
 * Returns { results, sched, bakingDT }
 */
export function calcDoughAndSchedule(formData, scheduleData) {
  // pick a safe datetime (used for schedule calc)
  const bakingDT =
    (scheduleData?.bakingDateTime &&
      String(scheduleData.bakingDateTime).trim()) ||
    dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm');

  const results = calculateDough({
    numPizzas: formData.numPizzas,
    ballWeight: formData.ballWeight,
    bigaPercent: formData.bigaPercent,
    bigaHydration: formData.bigaHydration,
    finalHydration: formData.finalHydration,
    bigaTime: formData.bigaTime,
    bigaTemp: formData.bigaTemp,
    doughTime: formData.doughTime,
    doughTemp: formData.doughTemp,
    yeastType: formData.yeastType,
    saltPercent: formData.saltPercent,
    maltPercent: formData.maltPercent,
    shortCorrection: formData.shortCorrection ?? 0,
    longCorrection: formData.longCorrection ?? 0,
  });

  const sched = calculatePrepSchedule({
    bakingDateTime: bakingDT,
    bigaPrepTime: scheduleData.bigaPrepTime,
    bigaRisingTime: scheduleData.bigaRisingTime,
    autolyzeRefreshPrep: scheduleData.autolyzeRefreshPrep,
    autolyzeRefreshRest: scheduleData.autolyzeRefreshRest,
    doughPrepTime: scheduleData.doughPrepTime,
    doughRisingTime: scheduleData.doughRisingTime,
    ballsPrepTime: scheduleData.ballsPrepTime,
    ballsRisingTime: scheduleData.ballsRisingTime,
    preheatOvenDuration: scheduleData.preheatOvenDuration,
    toppingsPrepTime: scheduleData.toppingsPrepTime,
  });

  return { results, sched, bakingDT };
}

/**
 * Build calculatedData exactly like Step7
 */
const toISO = (d) => {
  if (!d) return null;
  if (dayjs.isDayjs(d)) return d.toISOString();
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.toISOString() : null;
};

export function buildCalculatedData(results, sched, scheduleData) {
  if (!results || !sched) return null;

  const ingredients = {
    biga: {
      flour: Math.round(results.bigaFlour),
      water: Math.round(results.bigaWater),
      yeast: round(results.bigaYeast, 2),
      total: Math.round(
        results.bigaFlour + results.bigaWater + results.bigaYeast
      ),
    },
    refresh: {
      flour: Math.round(results.finalFlour),
      water: Math.round(results.finalWater),
      yeast: round(results.refreshYeast, 2),
      salt: round(results.totalSalt, 1),
      malt: round(results.totalMalt, 2),
      total: Math.round(
        results.finalFlour +
          results.finalWater +
          results.refreshYeast +
          results.totalSalt +
          results.totalMalt
      ),
    },
  };

  return {
    ingredients,
    timelineSteps: [
      {
        label: 'Prepare Biga',
        time: toISO(sched.prepBigaTime),
        description:
          'Mix biga ingredients and allow to ferment at cool room temperature. Keep it loosely covered.',
      },
      {
        label: 'Autolyze',
        time: toISO(sched.autolyzeRefreshTime),
        description:
          'Mix flour and water from refresh phase and let rest. This helps gluten develop before kneading.',
      },
      {
        label: 'Prepare Final Dough',
        time: toISO(sched.prepDoughTime),
        description:
          'Combine biga with the refresh dough, yeast, salt, and malt. Knead until smooth and elastic.',
      },
      {
        label: 'Prepare Balls',
        time: toISO(sched.prepBallsTime),
        description:
          'Divide dough into balls, place into your lightly oiled proofing container. Proof until double in size or refrigerate.',
      },
      {
        label: 'Preheat Oven',
        time: toISO(sched.preheatOvenTime),
        description:
          'Preheat your oven and pizza stone/steel to the maximum temperature available.',
      },
      {
        label: 'Prepare Toppings',
        time: toISO(sched.prepToppingsTime),
        description:
          'Prepare and portion your toppings so they’re ready when the dough is.',
      },
      {
        label: 'Bake Pizza',
        // IMPORTANT: new name from scheduleCalculator
        time: toISO(sched.bakingDateTime),
        description:
          'Stretch your dough, top your pizzas, and bake until golden and blistered. Enjoy!',
      },
    ],
  };
}

/**
 * Build ingredient table rows for Preview
 */
export function makeIngredientRows(calculatedData) {
  if (!calculatedData) return [];
  const b = calculatedData.ingredients.biga;
  const rf = calculatedData.ingredients.refresh;

  const flourTotal = b.flour + rf.flour;
  const totalWater = b.water + rf.water;
  const totalYeast = round(b.yeast + rf.yeast, 2);
  const totalSalt = rf.salt; // salt only in refresh
  const totalMalt = rf.malt; // malt only in refresh

  const pct = (grams, dp = 1) =>
    flourTotal ? `${round((grams / flourTotal) * 100, dp)}%` : '—';

  return [
    {
      label: 'Flour',
      biga: b.flour,
      refresh: rf.flour,
      total: flourTotal,
      bakers: '100%',
    },
    {
      label: 'Water',
      biga: b.water,
      refresh: rf.water,
      total: totalWater,
      bakers: pct(totalWater, 1),
    },
    {
      label: 'Yeast',
      biga: b.yeast,
      refresh: rf.yeast,
      total: totalYeast,
      bakers: pct(totalYeast, 2),
    },
    {
      label: 'Salt',
      biga: 0,
      refresh: rf.salt,
      total: totalSalt,
      bakers: pct(totalSalt, 1),
    },
    {
      label: 'Malt',
      biga: 0,
      refresh: rf.malt,
      total: totalMalt,
      bakers: pct(totalMalt, 2),
    },
    {
      label: 'Total',
      biga: b.total,
      refresh: rf.total,
      total: b.total + rf.total,
      bakers: '—',
    },
  ];
}
