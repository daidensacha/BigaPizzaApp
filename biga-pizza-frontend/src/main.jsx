import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthModalProvider } from "./context/AuthModalContext";
import { AuthProvider } from "./context/AuthContext";
import { RecipeProvider } from "./context/RecipeContext";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RecipeProvider>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
        <Toaster position="top-right" /> {/* ✅ Toast container */}
      </RecipeProvider>
    </AuthProvider>
  </React.StrictMode>
)