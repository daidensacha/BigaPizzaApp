// settingsConfig.js

const pizzaSettingsSections = [
  {
    title: "General",
    inputs: [
      { label: "Baking Date and Time", name: "bakingDateTime", type: "datetime-local" },
      { label: "Recipe for (pizzas)", name: "numPizzas", unit: "pcs" },
      { label: "Ball weight (g)", name: "ballWeight", unit: "g" },
      { label: "Dough Biga %", name: "bigaPercent", unit: "%" }
    ]
  },
  {
    title: "Biga",
    inputs: [
      { label: "Biga Hydration", name: "bigaHydration", unit: "%" },
      { label: "Duration (hrs)", name: "bigaTime", unit: "h" },
      { label: "Temperature (°C)", name: "bigaTemp", unit: "°C" }
    ]
  },
  {
    title: "Dough Refresh",
    inputs: [
      { label: "Final Dough Hydration", name: "finalHydration", unit: "%" },
      { label: "Salt (%)", name: "saltPercent", unit: "%" },
      { label: "Malt (%)", name: "maltPercent", unit: "%" },
      { label: "Duration (hrs)", name: "doughTime", unit: "h" },
      { label: "Temperature (°C)", name: "doughTemp", unit: "°C" }
    ]
  },
  {
    title: "Advanced Options",
    inputs: [
      { label: "Short Ferment Correction", name: "shortCorrection" },
      { label: "Long Ferment Correction", name: "longCorrection" }
    ]
  }
];

const scheduleSections = [
  {
    title: "Biga",
    inputs: [
      { label: "Prep time (min)", name: "bigaPrepTime", unit: "min" },
      { label: "Fermentation time (hrs)", name: "bigaRisingTime", unit: "h" }
    ]
  },
  {
    title: "Autolyze",
    inputs: [
      { label: "Prep time (min)", name: "autolyzeRefreshPrep", unit: "min" },
      { label: "Rest time (min)", name: "autolyzeRefreshRest", unit: "min" }
    ]
  },
  {
    title: "Pizza Dough",
    inputs: [
      { label: "Prep time (min)", name: "doughPrepTime", unit: "min" },
      { label: "Bulk Proofing (hrs)", name: "doughRisingTime", unit: "h" }
    ]
  },
  {
    title: "Dough Balls",
    inputs: [
      { label: "Prep time (min)", name: "ballsPrepTime", unit: "min" },
      { label: "Rising time (hrs)", name: "ballsRisingTime", unit: "h" }
    ]
  },
  {
    title: "Food Prep",
    inputs: [
      { label: "Food prep time (min)", name: "toppingsPrepTime", unit: "min" }
    ]
  },
  {
    title: "Preheat",
    inputs: [
      { label: "Preheat Oven (min)", name: "preheatOvenDuration", unit: "min" }
    ]
  }
];

export { pizzaSettingsSections, scheduleSections };
