import React, { useState } from "react";
import { calculatePrepSchedule } from "../../utils/scheduleCalculator";
import ScheduleSettingsDrawer from "../ScheduleSettingsDrawer";
import FormLabelWithTooltip from "../FormLabelWithTooltip";
import tooltips from "../../constants/tooltips";
import dayjs from "../../utils/dayjsConfig";
import labelMap from "../../utils/scheduleLabels";
import defaultScheduleSettings from "../../constants/defaultScheduleSettings";
import { useRecipe } from "../../context/RecipeContext";


export default function Step6PrepSchedule({ data, onCreateSchedule, onSkip, onChange }) {

  const { scheduleData, setScheduleData, resetScheduleData } = useRecipe();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const schedule = calculatePrepSchedule(scheduleData);

  const handleScheduleChange = (e) => {
  const { name, value } = e.target;
  setScheduleData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Preparation Timeline</h2>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 space-y-4">
        {Object.entries(schedule).map(([key, time]) => (
          <div key={key} className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-medium text-gray-700">
              {labelMap[key] || key}:
            </div>
            <div>
              {dayjs.isDayjs(time) ? time.format("ddd, MMM D • HH:mm") : "Invalid time"}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700">Need to adjust prep durations?</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Open Settings
        </button>
      </div>

      <div className="mt-6 flex space-x-4 justify-center">
        <button onClick={onCreateSchedule} className="bg-green-600 text-white px-4 py-2 rounded-md">
          Confirm Timeline
        </button>
        <button onClick={onSkip} className="border border-gray-300 px-4 py-2 rounded-md">
          Skip Schedule
        </button>
      </div>

      {/* Schedule Drawer */}
      <ScheduleSettingsDrawer
        isOpen={drawerOpen}
        // setIsOpen={setDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={scheduleData}
        onChange={handleScheduleChange}
        onReset={resetScheduleData}
      />
    </div>
  );
}
