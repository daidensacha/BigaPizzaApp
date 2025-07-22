import React from 'react';

export default function ProgressBar({ steps, currentStep }) {
  return (
    <div className="relative flex items-center justify-between mb-6">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div
              className={`z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isActive ? 'bg-blue-500 text-white' : ''}
                ${!isCompleted && !isActive ? 'bg-white border-2 border-gray-300 text-gray-700' : ''}
              `}
            >
              {step.id}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 transition-all
                  ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
