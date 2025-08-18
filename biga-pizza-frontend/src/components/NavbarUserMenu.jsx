import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  LayoutDashboard,
  BookOpen,
  UserRound,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AvatarBadge from '@/components/profile/AvatarBadge';

function itemClasses(active, danger = false) {
  return [
    'group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm',
    active
      ? danger
        ? 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300'
        : 'bg-gray-100 dark:bg-stone-700'
      : danger
      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-stone-700'
      : 'hover:bg-gray-100 dark:hover:bg-stone-700',
  ].join(' ');
}

export default function NavbarUserMenu({ onLogout, user }) {
  const navigate = useNavigate();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 text-sm font-medium focus:outline-none hover:text-red-600">
        {user?.avatarStyle && user?.avatarSeed ? (
          <AvatarBadge
            type={user.avatarStyle}
            seed={user.avatarSeed}
            size={24} // navbar size
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
        <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white dark:bg-stone-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 p-1">
          {/* Overview */}
          <Menu.Item>
            {({ active }) => (
              <Link to="/account" className={itemClasses(active)}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </Link>
            )}
          </Menu.Item>

          {/* My Recipes */}
          <Menu.Item>
            {({ active }) => (
              <Link to="/account/recipes" className={itemClasses(active)}>
                <BookOpen className="w-4 h-4" />
                <span>My Recipes</span>
              </Link>
            )}
          </Menu.Item>

          {/* Profile */}
          <Menu.Item>
            {({ active }) => (
              <Link to="/account/profile" className={itemClasses(active)}>
                <UserRound className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            )}
          </Menu.Item>

          {/* Settings */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/account/settings')}
                className={itemClasses(active)}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
            )}
          </Menu.Item>

          {/* Divider */}
          <div className="my-1 border-t border-stone-200 dark:border-stone-700" />

          {/* Logout */}
          <Menu.Item>
            {({ active }) => (
              <button onClick={onLogout} className={itemClasses(active, true)}>
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
