import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ScheduleInputs from './ScheduleInputs';
import PrepTimeline from './PrepTimeline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PrepScheduler({ doughInputs }) {
  const [scheduleInputs, setScheduleInputs] = useState({
    bakeTime: '',
    preheatTime: 90,
    foodPrepTime: 30,
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded bg-blue-900/20 p-1">
          {['Dough Inputs', 'Schedule Inputs', 'Timeline'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full rounded py-2.5 text-sm font-medium leading-5',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12]'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(doughInputs, null, 2)}</pre>
          </Tab.Panel>
          <Tab.Panel>
            <ScheduleInputs inputs={scheduleInputs} setInputs={setScheduleInputs} />
          </Tab.Panel>
          <Tab.Panel>
            <PrepTimeline doughInputs={doughInputs} scheduleInputs={scheduleInputs} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
