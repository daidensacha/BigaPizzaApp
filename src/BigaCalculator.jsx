import React, { useState } from 'react';
import DoughInputs from './DoughInputs';
import DoughResults from './DoughResults';
import { calculateDough, calculateDoughYeast } from './utils';

export default function BigaCalculator() {
  const [inputs, setInputs] = useState({numPizzas: 6,
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

  const results = calculateDough(inputs); // runs main calculator
  console.log('results:', results);
  // const yeastBiga = results.yeast; // from calculateDough()
  // const yeastBiga = results.yeastPercent;  // this is the baker's percentage yeast for biga
  const yeastBiga = results.bigaYeast;  // this is the baker's percentage yeast for biga
  const yeastFinal = calculateDoughYeast(inputs.doughTime, inputs.doughTemp, inputs.yeastType);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'yeastType' ? value : parseFloat(value) }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Biga Dough Calculator</h1>
      <DoughInputs inputs={inputs} onChange={handleChange} />
      <DoughResults
      results={results}
      yeastBiga={yeastBiga}
      yeastFinal={yeastFinal}
      />
    </div>
  );
}