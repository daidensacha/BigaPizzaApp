import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  recipeTitle,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-stone-800 dark:text-white">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-red-600 dark:text-red-400"
              >
                Confirm Delete
              </Dialog.Title>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-red-500">
                  {recipeTitle}
                </span>
                ? This action cannot be undone.
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded-md border dark:border-stone-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-stone-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                  onClick={onConfirm}
                >
                  Yes, Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
