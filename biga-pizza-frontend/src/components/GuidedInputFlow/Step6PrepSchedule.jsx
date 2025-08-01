import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { calculatePrepSchedule } from '@/utils/scheduleCalculator';
import ScheduleSettingsDrawer from '@/components/ScheduleSettingsDrawer';
import dayjs from '@/utils/dayjsConfig';
import labelMap from '@/utils/scheduleLabels';
import { useRecipe } from '@/context/RecipeContext';

export default function Step6PrepSchedule({ onCreateSchedule, onSkip }) {
  const {
    scheduleData,
    setScheduleData,
    resetScheduleData,
    formData,
    setTimelineConfirmed,
  } = useRecipe();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const schedule = calculatePrepSchedule({
    ...scheduleData,
    bakingDateTime: formData.bakingDateTime,
  });

  const { totalDuration, ...timelineEvents } = schedule;

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Preparation Timeline
      </h2>

      <div className="bg-white dark:bg-stone-800 dark:border-stone-800 dark:bg-opacity-50 rounded-xl shadow p-6 border border-gray-200 space-y-4">
        {Object.entries(timelineEvents).map(([key, time]) => (
          <div key={key} className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-medium text-gray-700 dark:text-yellow-600">
              {labelMap[key] || key}:
            </div>
            <div className="font-medium text-gray-700 dark:text-stone-300">
              {dayjs.isDayjs(time)
                ? time.format('ddd, MMM D • h:mm a')
                : 'Invalid time'}
            </div>
          </div>
        ))}
        {totalDuration && (
          <div className="flex justify-center text-sm text-gray-600 bg-yellow-100 dark:bg-stone-600 dark:text-stone-400 border border-yellow-300 dark:border-stone-900 px-3 py-1 rounded-full inline-block shadow-sm">
            Total Duration: {formatDuration(totalDuration)}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700 dark:text-stone-300 mr-2">
          Need to adjust prep durations?
        </p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Open Settings
        </button>
      </div>

      <div className="mt-6 flex space-x-4 justify-center">
        {/* Confirm Timeline button */}
        <button
          onClick={() => {
            setTimelineConfirmed(true);
            onCreateSchedule();
          }}
          className="bg-green-600 dark:bg-green-900 text-white dark:text-yellow-200 dark:hover:bg-green-800 px-4 py-2 rounded-md hover:bg-green-700"
        >
          Confirm Timeline
        </button>
        {/* Skip Schedule button */}
        <button
          onClick={() => {
            setTimelineConfirmed(false);
            toast('Heres your recipe - schedule skipped.');
            onSkip();
          }}
          className="border border-gray-300 px-4 py-2 dark:text-yellow-600 dark:bg-red-950 dark:hover:bg-red-900 dark:border-none rounded-md hover:bg-gray-100"
        >
          Skip Schedule
        </button>
      </div>

      <ScheduleSettingsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReset={resetScheduleData}
      />
    </div>
  );
}
