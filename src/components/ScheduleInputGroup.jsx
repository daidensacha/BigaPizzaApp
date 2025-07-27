export default function ScheduleInputGroup({ title, inputs }) {
  return (
    <div className="space-y-4">
      {/* <h3 className="text-md font-semibold text-stone-200 mb-2">{title}</h3> */}
      {inputs.map((input) => (
        <div key={input.name} className="flex flex-col space-y-1">
          <label htmlFor={input.name} className="text-sm text-yellow-600">
            {input.label}
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="px-2 py-1 border border-gray-700 bg-stone-800 text-stone-400 rounded"
              onClick={() => {
                const newValue = Math.max(parseInt(input.value || 0) - 1, 0);
                input.onChange({ target: { name: input.name, value: newValue } });
              }}
            >
              −
            </button>
            <input
              type="number"
              id={input.name}
              name={input.name}
              value={input.value || ''}
              onChange={input.onChange}
              className="w-24 rounded border-stone-700 bg-stone-800 text-stone-400 px-2 py-1"
            />
            <button
              type="button"
              className="px-2 py-1 border border-gray-700 bg-stone-800 text-stone-400 rounded"
              onClick={() => {
                const newValue = parseInt(input.value || 0) + 1;
                input.onChange({ target: { name: input.name, value: newValue } });
              }}
            >
              +
            </button>
            {input.unit && (
              <span className="text-sm text-stone-400 ml-1">{input.unit}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
