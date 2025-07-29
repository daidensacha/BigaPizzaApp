import inputConfig from "../constants/inputConfig";
import InputTooltip from "./ui/InputTooltip";

export default function ScheduleInputGroup({ title, inputs }) {
  return (
    <div className="space-y-4">
      {inputs.map((input) => {
        const config = inputConfig[input.name] || {};
        const { min, max, step, unit } = config;

        return (
          <div key={input.name} className="flex flex-col space-y-1">
            <InputTooltip
                label={input.label}
                min={inputConfig[input.name]?.min}
                max={inputConfig[input.name]?.max}
                theme="dark"
              />

            <div className="flex items-center space-x-2">
              {input.type === "datetime-local" ? (
                <input
                  type="datetime-local"
                  id={input.name}
                  name={input.name}
                  value={input.value || ""}
                  onChange={input.onChange}
                  className="w-full rounded border border-stone-700 bg-stone-800 text-stone-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-700 focus:border-yellow-700"
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="px-2 py-1 border border-gray-700 bg-stone-800 text-stone-400 rounded hover:bg-stone-700 focus:ring-1 focus:ring-yellow-700"
                    onClick={() => {
                      const val = parseFloat(input.value || 0);
                      const newValue = Math.max(val - (step || 1), min ?? 0);
                      input.onChange({ target: { name: input.name, value: newValue } });
                    }}
                  >
                    −
                  </button>
                  <input
                    type={input.type || "number"}
                    id={input.name}
                    name={input.name}
                    value={input.value || ""}
                    onChange={input.onChange}
                    min={min}
                    max={max}
                    step={step}
                    className="w-24 rounded border border-stone-700 bg-stone-800 text-stone-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-700 focus:border-yellow-700"
                  />
                  <button
                    type="button"
                    className="px-2 py-1 border border-gray-700 bg-stone-800 text-stone-400 rounded hover:bg-stone-700 focus:ring-1 focus:ring-yellow-700"
                    onClick={() => {
                      const val = parseFloat(input.value || 0);
                      const newValue = Math.min(val + (step || 1), max ?? Infinity);
                      input.onChange({ target: { name: input.name, value: newValue } });
                    }}
                  >
                    +
                  </button>
                  {unit && <span className="text-sm text-stone-400 ml-1">{unit}</span>}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
