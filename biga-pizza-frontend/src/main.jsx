import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthModalProvider } from "./context/AuthModalContext";
import { RecipeProvider } from "./context/RecipeContext";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecipeProvider>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
      <Toaster position="top-right" /> {/* ✅ Toast container */}
    </RecipeProvider>
  </React.StrictMode>
)