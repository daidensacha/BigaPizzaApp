// src/App.jsx
import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

import Home from '@pages/Home';
import CreateRecipe from '@pages/recipes/CreateRecipe';
import PizzaMenu from '@pages/PizzaMenu';
import Navbar from '@components/Navbar';

import { useRecipe } from '@context/RecipeContext';
import ScheduleSettingsDrawer from '@components/ScheduleSettingsDrawer';

import AuthModal from '@components/auth/AuthModal';
import { useAuthModal } from '@context/AuthModalContext';

import ProtectedRoute from '@components/routes/ProtectedRoute';

// Public recipe pages (view & quick-create)
import UserRecipeDetails from '@recipes/UserRecipeDetails';
import NewRecipeEntry from '@recipes/NewRecipeEntry';

// Account area pages
import UserDashboard from '@/pages/account/UserDashboard';
import UserDefaults from '@/pages/account/UserDefaults';
import UserProfile from '@/pages/account/UserProfile';
import UserAccount from '@/pages/account/UserAccount';
import AdminDashboard from '@/pages/account/AdminDashboard';
import UserRecipeList from '@recipes/UserRecipeList';
import EditRecipe from '@recipes/EditRecipe';

// Layout shell for all /account pages
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function AccountShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function AppInner() {
  const location = useLocation();
  const state = location.state || {};
  const background = location.state && location.state.background;

  const { isModalOpen, closeAuthModal } = useAuthModal();
  const {
    isSettingsDrawerOpen,
    setSettingsDrawerOpen,
    scheduleData,
    setScheduleData,
    resetScheduleData,
    resetFormData,
  } = useRecipe();

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 dark:from-orange-950 dark:to-slate-950 transition-colors duration-500">
      <Navbar />
      <main className="px-6 lg:px-8 py-8">
        <div className="transition-colors duration-500">
          {/* Render the "page underneath" (or the modal route directly if no background) */}
          <Routes location={background || location}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/menu" element={<PizzaMenu />} />
            {/* Include /recipes/new here so a direct visit works as a full page */}
            <Route path="/recipes/new" element={<NewRecipeEntry />} />
            <Route path="/recipes/:id" element={<UserRecipeDetails />} />

            {/* Account area (nested & protected) */}
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
              <Route path="recipes/:id/edit" element={<EditRecipe />} />
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

          {/* Render the modal ONLY if we have a background page */}
          {background && (
            <Routes>
              <Route path="/recipes/new" element={<NewRecipeEntry />} />
            </Routes>
          )}
        </div>
      </main>

      {/* Global drawers/modals */}
      <ScheduleSettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        data={scheduleData}
        onChange={handleScheduleChange}
        onReset={() => {
          resetScheduleData();
          resetFormData();
        }}
      />
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
