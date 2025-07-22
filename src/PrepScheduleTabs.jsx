import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import DoughInputs from "./DoughInputs";
import DoughResults from "./DoughResults";
import ScheduleInputs from "./ScheduleInputs";
import PrepTimeline from "./PrepTimeline";

export default function BigaCalculatorTabs({ inputs, results, onChange, yeastBiga, yeastFinal, scheduleInputs, onScheduleChange }) {
  return (
    <Tabs.Root defaultValue="dough" className="w-full">
      <Tabs.List className="flex space-x-2 border-b border-gray-300 mb-4">
        <Tabs.Trigger
          value="dough"
          className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-t-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 focus:outline-none"
        >
          Dough Calculator
        </Tabs.Trigger>

        <Tabs.Trigger
          value="schedule"
          className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-t-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 focus:outline-none"
        >
          Prep Schedule
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        value="dough"
        className="transition-opacity duration-300 opacity-100 data-[state=inactive]:opacity-0"
      >
        <DoughInputs inputs={inputs} onChange={onChange} />
        <DoughResults results={results} yeastBiga={yeastBiga} yeastFinal={yeastFinal} inputs={inputs} />
      </Tabs.Content>

      <Tabs.Content
        value="schedule"
        className="transition-opacity duration-300 opacity-100 data-[state=inactive]:opacity-0"
      >
        <div className="p-4 bg-yellow-100">Prep Schedule content loaded!</div>
        <ScheduleInputs scheduleInputs={scheduleInputs} onChange={onScheduleChange} />
        <PrepTimeline scheduleInputs={scheduleInputs} inputs={inputs} />
      </Tabs.Content>

    </Tabs.Root>
  );
}
