import dayjs from 'dayjs';

export function calculatePrepSchedule(scheduleData) {
  if (!scheduleData || !scheduleData.bakingDateTime) return [];

  const {
    bakingDateTime,
    bigaPrepTime,
    bigaRisingTime,
    autolyzeRefreshPrep,
    autolyzeRefreshRest,
    doughPrepTime,
    doughRisingTime,
    ballsPrepTime,
    ballsRisingTime,
    preheatOvenDuration,
    toppingsPrepTime,
  } = scheduleData;

  const bakeTime = dayjs(bakingDateTime);

  const prepToppingsTime = bakeTime.subtract(toppingsPrepTime + 30, 'minute');
  const preheatOvenTime = bakeTime.subtract(preheatOvenDuration, 'minute');
  const prepBallsTime = bakeTime.subtract(
    ballsPrepTime + ballsRisingTime,
    'minute'
  );
  const prepDoughTime = prepBallsTime.subtract(
    doughPrepTime + doughRisingTime,
    'minute'
  );
  const autolyzeRefreshTime = prepDoughTime.subtract(
    autolyzeRefreshPrep + autolyzeRefreshRest,
    'minute'
  );
  const prepBigaTime = prepDoughTime.subtract(
    bigaPrepTime + bigaRisingTime,
    'minute'
  );

  return [
    {
      label: 'Prepare Biga',
      time: prepBigaTime.toISOString(),
      description:
        'Mix biga ingredients and allow to ferment at cool room temperature. Keep it loosely covered.',
    },
    {
      label: 'Autolyze',
      time: autolyzeRefreshTime.toISOString(),
      description:
        'Mix flour and water from refresh phase and let rest. This helps gluten develop before kneading.',
    },
    {
      label: 'Prepare Final Dough',
      time: prepDoughTime.toISOString(),
      description:
        'Combine biga with the refresh dough, yeast, salt, and malt. Knead until smooth and elastic.',
    },
    {
      label: 'Prepare Balls',
      time: prepBallsTime.toISOString(),
      description:
        'Divide dough into balls, place into your lightly oiled proofing container. Proof until double in size or refrigerate.',
    },
    {
      label: 'Preheat Oven',
      time: preheatOvenTime.toISOString(),
      description:
        'Preheat your oven and pizza stone/steel to the maximum temperature available.',
    },
    {
      label: 'Prepare Toppings',
      time: prepToppingsTime.toISOString(),
      description:
        'Prepare and portion your toppings so they’re ready when the dough is.',
    },
    {
      label: 'Bake Pizza',
      time: bakeTime.toISOString(),
      description:
        'Stretch your dough, top your pizzas, and bake until golden and blistered. Enjoy!',
    },
  ];
}
