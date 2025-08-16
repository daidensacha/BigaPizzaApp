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
            <Toaster
              position="top-right"
              containerStyle={{ top: 80 }} // push below navbar {/* ✅ Toast container */}
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </RecipeProvider>
        </DefaultsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
