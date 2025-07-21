import React from 'react';

export default function DoughInputs({ inputs, onChange }) {
  const fields = [{ name: 'numPizzas', label: 'Number of Pizzas' },
    { name: 'ballWeight', label: 'Ball Weight (g)' },
    { name: 'finalHydration', label: 'Final Dough Hydration (%)' },
    { name: 'bigaPercent', label: 'Biga % in Dough' },
    { name: 'saltPercent', label: 'Salt %' },
    { name: 'maltPercent', label: 'Malt %' },
    { name: 'bigaTime', label: 'Biga Fermentation Time (hrs)' },
    { name: 'bigaTemp', label: 'Biga Fermentation Temp (°C)' },
    { name: 'doughTime', label: 'Dough Fermentation Time (hrs)' },
    { name: 'doughTemp', label: 'Dough Fermentation Temp (°C)' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type="number"
            name={name}
            value={inputs[name]}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      ))}

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Yeast Type</label>
        <select
          name="yeastType"
          value={inputs.yeastType}
          onChange={onChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="fresh">Fresh Yeast</option>
          <option value="ady">Active Dry Yeast (ADY)</option>
          <option value="idy">Instant Dry Yeast (IDY)</option>
        </select>
      </div>
    </div>
  );
}