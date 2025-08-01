import inputConfig from '@constants/inputConfig';

const withUnitAndMeta = (name, label, type) => ({
  label,
  name,
  ...(type && { type }),
  unit: inputConfig[name]?.unit,
  min: inputConfig[name]?.min,
  max: inputConfig[name]?.max,
  step: inputConfig[name]?.step,
});

const pizzaSettingsSections = [
  {
    title: 'General',
    inputs: [
      withUnitAndMeta(
        'bakingDateTime',
        'Baking Date and Time',
        'datetime-local'
      ),
      withUnitAndMeta('numPizzas', 'Recipe for (pizzas)'),
      withUnitAndMeta('ballWeight', 'Ball weight (g)'),
      withUnitAndMeta('bigaPercent', 'Dough Biga %'),
    ],
  },
  {
    title: 'Biga',
    inputs: [
      withUnitAndMeta('bigaHydration', 'Biga Hydration'),
      withUnitAndMeta('bigaTime', 'Duration (hrs)'),
      withUnitAndMeta('bigaTemp', 'Temperature (°C)'),
    ],
  },
  {
    title: 'Dough Refresh',
    inputs: [
      withUnitAndMeta('finalHydration', 'Final Dough Hydration'),
      withUnitAndMeta('saltPercent', 'Salt (%)'),
      withUnitAndMeta('maltPercent', 'Malt (%)'),
      withUnitAndMeta('doughTime', 'Duration (hrs)'),
      withUnitAndMeta('doughTemp', 'Temperature (°C)'),
    ],
  },
  {
    title: 'Advanced Options',
    inputs: [
      withUnitAndMeta('shortCorrection', 'Short Ferment Correction'),
      withUnitAndMeta('longCorrection', 'Long Ferment Correction'),
    ],
  },
];

const scheduleSections = [
  {
    title: 'Biga',
    inputs: [
      withUnitAndMeta('bigaPrepTime', 'Prep time (min)'),
      withUnitAndMeta('bigaRisingTime', 'Fermentation time (hrs)'),
    ],
  },
  {
    title: 'Autolyze',
    inputs: [
      withUnitAndMeta('autolyzeRefreshPrep', 'Prep time (min)'),
      withUnitAndMeta('autolyzeRefreshRest', 'Rest time (min)'),
    ],
  },
  {
    title: 'Pizza Dough',
    inputs: [
      withUnitAndMeta('doughPrepTime', 'Prep time (min)'),
      withUnitAndMeta('doughRisingTime', 'Bulk Proofing (hrs)'),
    ],
  },
  {
    title: 'Dough Balls',
    inputs: [
      withUnitAndMeta('ballsPrepTime', 'Prep time (min)'),
      withUnitAndMeta('ballsRisingTime', 'Rising time (hrs)'),
    ],
  },
  {
    title: 'Food Prep',
    inputs: [withUnitAndMeta('toppingsPrepTime', 'Food prep time (min)')],
  },
  {
    title: 'Preheat',
    inputs: [withUnitAndMeta('preheatOvenDuration', 'Preheat Oven (min)')],
  },
];

export { pizzaSettingsSections, scheduleSections };
