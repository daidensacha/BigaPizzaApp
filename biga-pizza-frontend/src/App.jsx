import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CreateRecipe from "./pages/CreateRecipe";
import PizzaMenu from "./pages/PizzaMenu";
import Navbar from './components/Navbar';
import { useRecipe } from "./context/RecipeContext";
import ScheduleSettingsDrawer from "./components/ScheduleSettingsDrawer";
import AuthModal from "./components/Auth/AuthModal";
import { useAuthModal } from "./context/AuthModalContext";

function App() {
  const { isModalOpen, closeAuthModal } = useAuthModal();

    const {
    isSettingsDrawerOpen,
    setSettingsDrawerOpen,
    scheduleData,
    setScheduleData,
    resetScheduleData,
  } = useRecipe();

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
  <Router>
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 dark:from-orange-950 dark:to-slate-950 transition-colors duration-500">
      {/* <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 transition-colors duration-500"> */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Remove dark theme - dark back ground */}
        {/* <div className="dark:bg-stone-900 text-yellow-100 rounded-xl transition-colors duration-500"> */}
        <div className="text-yellow-100 rounded-xl transition-colors duration-500">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/menu" element={<PizzaMenu />} />
          </Routes>
        </div>
      </main>

      <ScheduleSettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        data={scheduleData}
        onChange={handleScheduleChange}
        onReset={resetScheduleData}
      />
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </div>

  </Router>
);

}

export default App;