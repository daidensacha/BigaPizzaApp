import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NavbarUserMenu({ onOpenSettings, onLogout, user }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 text-sm font-medium focus:outline-none hover:text-red-600">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <span>Account</span>
        )}
        <ChevronDown className="w-4 h-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-stone-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/my-recipes"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-stone-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  📖 My Recipes
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/account"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-stone-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  👤 Account Overview
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onOpenSettings}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-stone-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  ⚙️ Settings
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onLogout?.()}
                  className={`${
                    active ? 'bg-red-100 dark:bg-stone-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600`}
                >
                  🔓 Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
