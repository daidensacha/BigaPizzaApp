import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RecipeProvider } from "./context/RecipeContext";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecipeProvider>
      <App />
      <Toaster position="top-right" /> {/* ✅ Toast container */}
    </RecipeProvider>
  </React.StrictMode>
)