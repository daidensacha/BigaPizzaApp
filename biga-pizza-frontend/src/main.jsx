import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import './index.css';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { AuthProvider } from '@/context/AuthContext';
import { RecipeProvider } from '@/context/RecipeContext';
import { DefaultsProvider } from '@/context/DefaultsContext';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DefaultsProvider>
          <RecipeProvider>
            <AuthModalProvider>
              <App />
            </AuthModalProvider>
            <Toaster position="top-right" /> {/* ✅ Toast container */}
          </RecipeProvider>
        </DefaultsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
