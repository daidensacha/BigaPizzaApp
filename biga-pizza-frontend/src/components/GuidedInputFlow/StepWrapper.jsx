import React from 'react';

export default function StepWrapper({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  isNextDisabled = false,
  isLastStep = false,
}) {
  return (
    <div className="rounded-2xl shadow-md bg-white text-gray-900 p-6 bg-opacity-40 dark:bg-opacity-40 border dark:shadow dark:bg-stone-600 dark:text-gray-100 dark:border-stone-800">
      <div className="text-sm text-gray-800 dark:text-stone-100 text-center">
        Step{' '}
        <span className="font-medium text-gray-800 dark:text-stone-100">
          {step}
        </span>{' '}
        of{' '}
        <span className="font-medium text-gray-800 dark:text-stone-100">
          {totalSteps}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="space-y-4 flex flex-col justify-center">{children}</div>
      </div>

      <div className="flex justify-between items-center pt-6">
        {!isLastStep && (
          <>
            <button
              onClick={onBack}
              disabled={step === 1}
              className={`px-4 py-2 text-sm rounded-md text-white transition
            ${
              step === 1
                ? 'bg-gray-300 dark:bg-gray-400 border border-gray-400 dark:text-gray-300 dark:border dark:border-gray-700 cursor-not-allowed'
                : 'bg-blue-500 border border-blue-600 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:border dark:border-blue-800'
            }`}
            >
              Back
            </button>

            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 border border-blue-600 dark:bg-blue-600 dark:border dark:border-blue-800 dark:hover:bg-blue-500 text-white disabled:opacity-50 transition"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
