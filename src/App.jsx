import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CreateRecipe from "./pages/CreateRecipe";
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
      </Routes>
    </Router>
  );
}

export default App;