import React from 'react';
import { format, subHours, subMinutes, parseISO } from 'date-fns';

export default function PrepTimeline({ scheduleInputs, inputs }) {
  if (!scheduleInputs.bakeTime) return <p className="text-sm text-gray-500">Select a baking time to generate a timeline.</p>;

  const bakeTime = parseISO(scheduleInputs.bakeTime);

  const doughStart = subHours(bakeTime, inputs.doughTime);
  const bigaStart = subHours(doughStart, inputs.bigaTime);
  const foodPrep = scheduleInputs.foodPrepTime ? subMinutes(bakeTime, scheduleInputs.foodPrepTime) : null;
  const preheat = scheduleInputs.preheatTime ? subMinutes(bakeTime, scheduleInputs.preheatTime) : null;

  return (
    <div className="mt-6 space-y-2 bg-gray-50 border rounded p-4">
      <h2 className="text-lg font-semibold text-gray-800">Prep Timeline</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        {foodPrep && <li><strong>Start food prep:</strong> {format(foodPrep, 'PPpp')}</li>}
        {preheat && <li><strong>Preheat oven:</strong> {format(preheat, 'PPpp')}</li>}
        <li><strong>Ball dough:</strong> {format(doughStart, 'PPpp')}</li>
        <li><strong>Start final dough fermentation:</strong> {format(doughStart, 'PPpp')}</li>
        <li><strong>Start biga fermentation:</strong> {format(bigaStart, 'PPpp')}</li>
        <li><strong>Bake time:</strong> {format(bakeTime, 'PPpp')}</li>
      </ul>
    </div>
  );
}

