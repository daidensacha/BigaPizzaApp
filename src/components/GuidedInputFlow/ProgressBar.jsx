import React from 'react';

export default function ProgressBar({ steps, currentStep }) {
  const progressPercent =
    steps.length > 1
      ? ((currentStep - 1) / (steps.length - 1)) * 100
      : 0;

  return (
    <div className="relative w-full mb-6">
      {/* Background line */}
      <div className="absolute top-4 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2 z-0" />

      {/* Progress line */}
      <div
        className="absolute top-4 left-0 h-1 bg-green-500 z-10 transform -translate-y-1/2 transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Step dots */}
      <div className="relative flex justify-between items-center z-20">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-all
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-blue-500 text-white' : ''}
                  ${!isCompleted && !isActive ? 'bg-white border-2 border-gray-300 text-gray-700' : ''}
                `}
              >
                {step.id}
              </div>
              <div className="mt-2 text-xs text-gray-700">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
