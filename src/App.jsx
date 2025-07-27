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
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
      </Routes>
        <ScheduleSettingsDrawer
          isOpen={isSettingsDrawerOpen}
          onClose={() => setSettingsDrawerOpen(false)}
          data={scheduleData}
          onChange={handleScheduleChange}
          onReset={resetScheduleData}
        />
    </Router>
  );
}

export default App;