const tooltips = {
  bigaPercent: {
    tooltip:
      'The percentage of prefermented flour (biga) used in the final dough. Common ranges are 30–50%. Higher % can increase flavor and shelf life.',
    textColor: 'text-gray-700',
  },
  bigaHydration: {
    tooltip:
      'Hydration level of the biga (flour/water ratio). Typically 45–50% for traditional biga. Lower hydration gives more strength.',
    textColor: 'text-blue-700',
  },
  finalHydration: {
    tooltip:
      'Overall dough hydration, including water from both biga and final dough. Higher hydration makes softer, more open crumb.',
    textColor: 'text-green-700',
  },
  saltPercent: {
    tooltip:
      'Salt strengthens gluten, improves flavor, and slows fermentation. Typical range is 2.5–3.5% of flour weight.',
    textColor: 'text-yellow-700',
  },
  maltPercent: {
    tooltip:
      'Malt (diastatic or non-diastatic) can aid browning and fermentation. Optional—usually 0–1%.',
    textColor: 'text-purple-700',
  },
  bigaTime: {
    tooltip:
      'How long the biga ferments before being added to final dough. Longer times create more flavor but risk over-fermentation.',
    textColor: 'text-blue-700',
  },
  bigaTemp: {
    tooltip:
      'Biga fermentation temperature. Colder temps slow fermentation. Typical is 16–18°C or cold retard (4–6°C).',
    textColor: 'text-blue-700',
  },
  doughTime: {
    tooltip:
      'Final dough fermentation time after mixing. Affects yeast amount and dough flavor.',
    textColor: 'text-green-700',
  },
  doughTemp: {
    tooltip:
      'Temperature of final dough fermentation. Warmer temps speed up fermentation.',
    textColor: 'text-green-700',
  },
  yeastType: {
    tooltip:
      'Choose between IDY (Instant Dry Yeast), ADY (Active Dry Yeast), or CY (Fresh Yeast). Each has different potency.',
    textColor: 'text-gray-700',
  },
  ballWeight: {
    tooltip:
      'The weight of a single dough ball, e.g., 250–280g for Neapolitan pizza. Add 10g per ball to allow for wieght loss during making.',
    textColor: 'text-gray-700',
  },
  bakingDateTime: {
    tooltip:
      'The planned time for baking. Used to automatically back-calculate your preparation schedule.',
    textColor: 'text-gray-700',
  },
  ingredientBreakdown: {
    tooltip:
      'Yeast % is estimated based on temp, time, and yeast type. Biga and Refresh yeast are calculated separately.',
    textColor: 'text-gray-700',
  },
};

export default tooltips;
