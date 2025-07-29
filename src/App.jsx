import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CreateRecipe from "./pages/CreateRecipe";
import Navbar from './components/Navbar';
import { useRecipe } from "./context/RecipeContext";
import ScheduleSettingsDrawer from "./components/ScheduleSettingsDrawer";

function App() {

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
    {/* <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 transition-colors duration-500"> */}
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 transition-colors duration-500">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="dark:bg-stone-900 text-yellow-100 rounded-xl transition-colors duration-500">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
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
    </div>
  </Router>
);

}

export default App;