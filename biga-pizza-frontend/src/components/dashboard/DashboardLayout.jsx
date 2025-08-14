// src/components/dashboard/DashboardLayout.jsx
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="font-semibold">Biga Pizza • Dashboard</span>
        <div className="w-6" />
      </header>

      <div className="mx-auto">
        <div className="flex items-start">
          {/* Sidebar */}
          <aside
            className={[
              'fixed lg:sticky top-0 lg:top-14 z-50 lg:z-10',
              'h-full lg:h-auto w-72 lg:w-64',
              'bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800',
              'lg:max-h-[calc(100vh-3.5rem)] lg:overflow-auto',
              open ? '' : 'hidden lg:block',
            ].join(' ')}
          >
            <div className="hidden lg:flex items-center h-14 px-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold">
              Biga Pizza • Dashboard
            </div>

            <nav className="p-3 space-y-1">
              <Item to="/account" label="Overview" exact />
              <Item to="/account/recipes" label="My Recipes" />
              <Item to="/account/defaults" label="My Defaults" />
              <Item to="/account/profile" label="Profile" />
            </nav>
          </aside>

          {/* Backdrop (mobile) */}
          {open && (
            <div
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function Item({ to, label, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        [
          'block px-3 py-2 rounded-md transition',
          isActive
            ? 'bg-yellow-600/20 text-yellow-900 dark:text-yellow-200'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}
