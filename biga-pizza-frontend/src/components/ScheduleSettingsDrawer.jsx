import React, { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronUp, X } from 'lucide-react';
import ScheduleInputGroup from '@components/ScheduleInputGroup';
import { useRecipe } from '@context/RecipeContext';
import YeastTypeToggleGroup from '@ui/YeastTypeToggleGroup';
import toast from 'react-hot-toast';
import {
  pizzaSettingsSections,
  scheduleSections,
} from '@constants/settingsConfig';
import defaultScheduleSettings from '@constants/defaultScheduleSettings';

export default function ScheduleSettingsDrawer({
  isOpen,
  onClose,
  data,
  onChange,
  onReset,
}) {
  const [activeSectionKey, setActiveSectionKey] = useState('pizza:General');
  const { formData, setFormData, resetFormData, resetScheduleData } =
    useRecipe();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const closeButtonRef = useRef(null);

  const handleConfirmReset = () => {
    // Remove focus from the confirm button to avoid aria-hidden violation
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    resetFormData();
    onReset();
    toast.success('Settings reset to defaults', {
      duration: 3000,
      icon: '✅',
    });
    setIsResetDialogOpen(false);
  };

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur(); // Prevent focus on hidden elements
    }
    onClose();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderAccordionSection = (section, type) => {
    const sectionKey = `${type}:${section.title}`;
    const isOpen = activeSectionKey === sectionKey;

    const isPizza = type === 'pizza';
    const state = isPizza
      ? formData
      : {
          ...defaultScheduleSettings,
          ...(data ?? {}),
        };
    const handleChange = isPizza ? handleFormChange : onChange;

    return (
      <div
        key={sectionKey}
        className={`border border-stone-600 rounded-lg ${
          isOpen ? 'bg-stone-700 border-1 border-yellow-800' : ''
        }`}
      >
        <button
          className={`flex justify-between w-full px-4 py-2 text-left text-sm font-medium text-yellow-700 bg-stone-800 hover:bg-red-950 ${
            isOpen ? 'bg-stone-700' : ''
          }`}
          onClick={() =>
            setActiveSectionKey((prev) =>
              prev === sectionKey ? null : sectionKey
            )
          }
        >
          <span>{section.title}</span>
          <ChevronUp
            className={`${
              isOpen ? 'rotate-180' : ''
            } h-5 w-5 text-stone-200 transition-transform`}
          />
        </button>

        {isOpen && (
          <div className="px-4 pt-4 pb-2 bg-stone-600">
            <ScheduleInputGroup
              title={section.title}
              inputs={section.inputs.map((input) => ({
                ...input,
                value: state[input.name] ?? '',
                onChange: handleChange,
              }))}
            />
            {isPizza && section.title === 'General' && (
              <div>
                <label className="text-sm pt-4 text-yellow-500 block mb-2">
                  Yeast Type
                </label>
                <YeastTypeToggleGroup
                  value={formData.yeastType}
                  onChange={handleFormChange}
                  theme="dark"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Main Drawer */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex justify-end">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative w-full max-w-md bg-stone-700 shadow-xl p-6 overflow-y-auto">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-xl font-semibold text-neutral-400">
                      Pizza Settings
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      aria-label="Close settings"
                      className="text-stone-400 hover:text-stone-500 border border-stone-600 bg-stone-800 rounded-lg p-1 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Helper note (beginner-friendly) */}
                  <p className="text-xs text-gray-500 mb-2">
                    Changes here affect <strong>this recipe only</strong>.<br />{' '}
                    To set your personal defaults, go to{' '}
                    <em>Dashboard → Settings</em>.
                  </p>

                  {/* Accordion Sections */}
                  <div className="space-y-2 mb-6">
                    {pizzaSettingsSections.map((section) =>
                      renderAccordionSection(section, 'pizza')
                    )}
                  </div>

                  <div className="border-t border-stone-500 my-6" />

                  <Dialog.Title className="text-xl font-semibold mb-4 text-neutral-400">
                    Schedule Settings
                  </Dialog.Title>

                  <div className="space-y-2">
                    {scheduleSections.map((section) =>
                      renderAccordionSection(section, 'schedule')
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setIsResetDialogOpen(true)}
                      className="text-red-700 border border-red-950 bg-stone-800 px-4 py-2 mr-1 rounded hover:text-stone-300 hover:bg-red-900 hover:border-stone-800"
                    >
                      Reset
                    </button>
                    <button
                      ref={closeButtonRef}
                      onClick={handleClose}
                      className="text-gray-300 border border-stone-800 bg-stone-800 px-4 py-2 rounded hover:bg-stone-950"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Reset Confirmation Dialog OUTSIDE the drawer */}
      <Transition appear show={isResetDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsResetDialogOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-lg bg-stone-800 p-6 text-white border border-stone-600">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Reset Schedule?
              </Dialog.Title>
              <p className="text-sm mb-6 text-stone-300">
                This will reset all schedule values to their default settings.
                Are you sure?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsResetDialogOpen(false)}
                  className="px-4 py-2 text-sm rounded bg-stone-700 hover:bg-stone-600 border border-stone-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-4 py-2 text-sm rounded bg-red-700 hover:bg-red-800 text-white"
                >
                  Confirm
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
