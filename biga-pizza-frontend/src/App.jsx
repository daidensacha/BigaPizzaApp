// src/App.jsx
import React from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';

import Navbar from '@components/Navbar';
import ProtectedRoute from '@components/routes/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ModalRecipeEditor from '@/components/recipes/ModalRecipeEditor';

// Public pages
import Home from '@pages/Home';
import CreateRecipe from '@pages/guided/CreateRecipe';
import PizzaMenu from '@pages/PizzaMenu';

// Account pages
import UserDashboard from '@/pages/account/UserDashboard';
import UserDefaults from '@/pages/account/UserDefaults';
import UserProfile from '@/pages/account/UserProfile';
import UserAccount from '@/pages/account/UserAccount';
import AdminDashboard from '@/pages/account/AdminDashboard';
import UserRecipeList from '@/pages/account/recipes/UserRecipeList';
import UserRecipeDetails from '@/pages/account/recipes/UserRecipeDetails';

function AccountShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default function AppInner() {
  const location = useLocation();

  // background overlay support
  const background = location.state?.backgroundLocation;
  const isEditor = location.pathname.startsWith('/editor/');
  const baseLocation = isEditor && background ? background : location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 dark:from-orange-950 dark:to-slate-950 transition-colors duration-500">
      <Navbar />

      <main className="px-6 lg:px-8 py-8">
        {/* BASE LAYER — always rendered (keeps navbar/layout visible) */}
        <Routes location={baseLocation}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/menu" element={<PizzaMenu />} />

          {/* Legacy redirects (optional) */}
          <Route
            path="/recipes"
            element={<Navigate to="/account/recipes" replace />}
          />
          <Route
            path="/recipes/new"
            element={<Navigate to="/editor/create" replace />}
          />

          {/* Account (protected + nested) */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="recipes" element={<UserRecipeList />} />
            <Route path="recipes/:id" element={<UserRecipeDetails />} />
            <Route path="defaults" element={<UserDefaults />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserAccount />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>

        {/* OVERLAY LAYER — only render on /editor/* */}
        {isEditor && (
          <Routes>
            <Route
              path="/editor/create"
              element={
                <ProtectedRoute>
                  <ModalRecipeEditor mode="create" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <ModalRecipeEditor mode="edit" />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}
