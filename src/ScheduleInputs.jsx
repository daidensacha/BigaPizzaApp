import React from 'react';

export default function ScheduleInputs({ scheduleInputs, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Baking Date/Time</label>
        <input
          type="datetime-local"
          name="bakeTime"
          value={scheduleInputs.bakeTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Oven Preheat Time (min)</label>
        <input
          type="number"
          name="preheatTime"
          value={scheduleInputs.preheatTime}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Food Prep Time (min)</label>
        <input
          type="number"
          name="foodPrepTime"
          value={scheduleInputs.foodPrepTime}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
        />
      </div>
    </div>
  );
}
