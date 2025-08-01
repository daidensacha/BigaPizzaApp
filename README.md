# BigaPizzaApp

App for creating biga pizza dough recipes for wood fired pizza enthusiasts.

# Biga Pizza App 🍕

A full-stack pizza dough calculator and recipe manager app, built with:

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: Cookie-based session auth with `httpOnly` cookies
- **Storage**: Users can save and manage custom recipes
- **UI**: Modern, responsive UI with custom fermentation timeline tools

---

## 🗂 Project Structure

```txt
.
├── biga-pizza-backend        # Express backend
│   ├── config/               # MongoDB config
│   ├── controllers/          # authController, recipeController
│   ├── middleware/           # authMiddleware
│   ├── models/               # Mongoose models: User, Recipe
│   ├── routes/               # Express routes: authRoutes, recipeRoutes
│   ├── utils/                # cookieOptions
│   └── server.js             # Entry point

└── biga-pizza-frontend       # Vite + React frontend
    ├── public/images/        # Pizza images
    ├── src/
    │   ├── App.jsx           # Main routing and layout
    │   ├── main.jsx          # Vite entry point
    │   ├── assets/           # Static assets (if needed)
    │   ├── components/       # Reusable components
    │   │   ├── auth/         # AuthModal
    │   │   ├── guidedinputflow/ # Step-by-step dough input UI
    │   │   ├── pizzas/       # PizzaCard, etc.
    │   │   ├── routes/       # ProtectedRoute
    │   │   ├── ui/           # UI helpers (tooltips, toggles)
    │   ├── context/          # Global state (Auth, Recipe)
    │   ├── constants/        # Config for forms, tooltips
    │   ├── data/             # Static data: pizzaMenu, recipeSteps
    │   ├── pages/
    │   │   ├── Home.jsx      # Landing page
    │   │   ├── accounts/
    │   │   │   ├── AccountPage.jsx
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── UserAccount.jsx
    │   │   │   └── UserDashboard.jsx
    │   │   ├── pizzamenu/
    │   │   │   └── index.jsx
    │   │   └── recipes/
    │   │       ├── CreateRecipe.jsx
    │   │       ├── UserRecipeDetails.jsx
    │   │       └── UserRecipeList.jsx
    │   ├── services/         # API services (authService)
    │   ├── styles/           # global.css
    │   └── utils/            # dateUtils, scheduleCalculator, toastUtils, etc.
```
