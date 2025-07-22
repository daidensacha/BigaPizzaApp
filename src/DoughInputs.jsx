import React from 'react';

export default function DoughInputs({ inputs, onChange }) {
  const fields = [{ name: "numPizzas", label: "Number of Pizzas", type: "range", min: 1, max: 15, step: 1 },
  { name: "ballWeight", label: "Ball Weight", type: "range", min: 240, max: 300, step: 5, unit: "g" },
  { name: "finalHydration", label: "Final Dough Hydration", type: "range", min: 60, max: 80, step: 1, unit: "%" },
  { name: "bigaPercent", label: "Biga in Dough", type: "range", min: 20, max: 100, step: 1, unit: "%" },
  { name: "saltPercent", label: "Salt %", type: "number", min: 0, max: 5, step: 0.1 },
  { name: "maltPercent", label: "Malt %", type: "number", min: 0, max: 5, step: 0.1 },
  { name: "bigaTime", label: "Biga Fermentation Time", type: "range", min: 12, max: 48, step: 1, unit: "hrs"},
  { name: "bigaTemp", label: "Biga Fermentation Temp", type: "range", min: 4, max: 22, step: 0.5, unit: "°C" },
  { name: "doughTime", label: "Dough Fermentation Time", type: "range", min: 4, max: 96, step: 1, unit: "hrs" },
  { name: "doughTemp", label: "Dough Fermentation Temp", type: "range", min: 4, max: 24, step: 0.5, unit: "°C" },
  { name: "yeastType", label: "Yeast Type", type: "select", options: [{value: "idy", label: "Instant Dry Yeast"}, {value: "ady", label: "Active Dry Yeast"}, {value: "fresh", label: "Fresh Yeast"} ]}

  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map(({ name, label, type, options, ...rest }) => (
      <div key={name} className="col-span-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {type === "range" && typeof inputs[name] !== "undefined"
            ? name === "bigaPercent" || name === "finalHydration"
              ? `${inputs[name]}% ${label}` // show % before label
              : `${label}: ${inputs[name]}${rest.unit || ""}` // show value after label
            : label}
        </label>

        {type === "select" ? (
          <select
            id={name}
            name={name}
            value={inputs[name]}
            onChange={onChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "range" ? (
          <div className="mt-1">
            <input
              type="range"
              id={name}
              name={name}
              value={inputs[name]}
              onChange={onChange}
              {...rest}
              className="w-full"
            />
            {/* <div className="text-right text-sm text-gray-600 mt-1">
              {inputs[name]}%
            </div> */}
          </div>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={inputs[name]}
            onChange={onChange}
            {...rest}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        )}
      </div>
      ))}


      {/* <div className="col-span-2">
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
      </div> */}
    </div>
  );
}