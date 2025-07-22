import React, { useState } from 'react';
import PrepScheduleTabs from './PrepScheduleTabs'; // ✅ NEW
import { calculateDough, calculateDoughYeast } from './utils';

export default function BigaCalculator() {
  const [inputs, setInputs] = useState({
    numPizzas: 6,
    ballWeight: 280,
    finalHydration: 68,
    bigaPercent: 100,
    saltPercent: 3,
    maltPercent: 0.5,
    bigaTime: 24,
    bigaTemp: 22,
    doughTime: 24,
    doughTemp: 22,
    yeastType: 'idy',
  });

  const [scheduleInputs, setScheduleInputs] = useState({
    bakeTime: '',
    preheatTime: 60,     // default in minutes
    foodPrepTime: 30,    // default in minutes
  });

  const results = calculateDough(inputs);
  const yeastBiga = results.bigaYeast;
  const yeastFinal = calculateDoughYeast(inputs.doughTime, inputs.doughTemp, inputs.yeastType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'yeastType' ? value : parseFloat(value) }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Biga Dough Planner</h1>

      <PrepScheduleTabs
        inputs={inputs}
        results={results}
        onChange={handleChange}
        yeastBiga={yeastBiga}
        yeastFinal={yeastFinal}
        scheduleInputs={scheduleInputs}
        onScheduleChange={handleScheduleChange}
      />
    </div>
  );
}
