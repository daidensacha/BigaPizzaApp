# BigaPizzaApp 🍕

A modern web app for generating and saving Neapolitan-style biga pizza dough recipes with a built-in prep timeline and fermentation scheduler.

---

## 🗂 Project Structure

```bash
├── README.md                  # ← You’re reading this!
├── biga-pizza-backend         # Express + MongoDB API backend
│   ├── config
│   │   └── db.js              # MongoDB connection setup
│   ├── controllers
│   │   ├── authController.js  # Register, login, and auth handling
│   │   └── recipeController.js# CRUD operations for recipes
│   ├── middleware
│   │   └── authMiddleware.js  # Protect routes, validate user sessions
│   ├── models
│   │   ├── Recipe.js          # Mongoose model for recipes
│   │   └── User.js            # Mongoose model for users
│   ├── routes
│   │   ├── authRoutes.js      # API routes for user auth
│   │   └── recipeRoutes.js    # API routes for recipe actions
│   ├── server.js              # Entry point to start the backend server
│   └── utils
│       ├── cookieOptions.js   # Centralized cookie settings
│       └── scheduleCalculator.js # Server-side schedule generator

biga-pizza-frontend            # React frontend with Vite + Tailwind CSS
├── README.md
├── index.html
├── public
│   └── images/                # Pizza images used in the menu
│       ├── margherita.jpeg
│       ├── diavola.jpeg
│       └── …
└── src
├── App.jsx                # Main app router and layout
├── main.jsx               # React entry point
├── index.css              # Tailwind + global styles
├── styles/
│   └── global.css         # Custom CSS overrides
├── config/
│   └── index.js           # App-wide config (e.g. API base URL)
├── constants/             # Static app configs
│   ├── defaultScheduleSettings.js
│   ├── inputConfig.js
│   ├── settingsConfig.js
│   └── tooltips.js
├── context/
│   ├── AuthContext.jsx    # Auth state and user session
│   ├── AuthModalContext.jsx
│   └── RecipeContext.jsx  # Stores form and schedule data
├── components/
│   ├── Navbar.jsx
│   ├── NavbarUserMenu.jsx
│   ├── ScheduleInputGroup.jsx
│   ├── ScheduleSettingsDrawer.jsx
│   ├── FormLabelWithTooltip.jsx
│   ├── auth/
│   │   └── AuthModal.jsx
│   ├── guidedinputflow/   # Step-by-step input flow
│   │   ├── Step1BasicInfo.jsx
│   │   ├── Step2Hydration.jsx
│   │   ├── Step3Fermentation.jsx
│   │   ├── Step4YeastType.jsx
│   │   ├── Step5RecipePreview.jsx
│   │   ├── Step6PrepSchedule.jsx
│   │   ├── Step7FinalRecipe.jsx
│   │   └── StepWrapper.jsx
│   ├── hooks/             # Custom hooks (empty for now)
│   ├── lib/
│   │   └── utils.js       # General helper functions
│   ├── pizzas/
│   │   └── PizzaCard.jsx  # Pizza menu display component
│   ├── recipes/           # Saved recipe-related components
│   │   ├── RecipeCard.jsx
│   │   ├── StarRating.jsx
│   │   └── StarRatingInput.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   └── ui/                # Generic reusable UI components
│       ├── ConfirmDeleteDialog.jsx
│       ├── GuidedInputField.jsx
│       ├── InputTooltip.jsx
│       ├── ThemeToggle.jsx
│       ├── Tooltip.jsx
│       ├── YeastTypePopoverSelector.jsx
│       ├── YeastTypeToggleGroup.jsx
│       ├── avatar.jsx
│       └── dropdown-menu_backup.jsx
├── data/
│   ├── pizzaMenu.js       # Static list of pizza options
│   └── recipeSteps.js     # Timeline steps + labels
├── pages/                 # Top-level pages for routing
│   ├── Home.jsx
│   ├── pizzamenu/
│   │   └── index.jsx
│   ├── accounts/
│   │   ├── AccountPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── UserAccount.jsx
│   │   └── UserDashboard.jsx
│   └── recipes/
│       ├── CreateRecipe.jsx
│       ├── EditRecipe.jsx
│       ├── UserRecipeDetails.jsx
│       └── UserRecipeList.jsx
├── services/
│   ├── authService.js     # API calls for auth
│   └── recipeService.js   # API calls for recipes
└── utils/
├── dateUtils.js
├── dayjsConfig.js     # Shared dayjs formatting
├── previewHelpers.js
├── recipeFormatting.js
├── scheduleCalculator.js
├── scheduleLabels.js
├── theme.js
├── toastUtils.js
└── utils.js
```

---

## 🚀 Features

- Step-by-step recipe builder for biga pizza dough
- Automatic yeast % calculator (based on time, temp, and yeast type)
- Fermentation and preparation timeline generation
- User accounts, login/logout, recipe saving
- Admin panel (in progress)
- Dark mode toggle, tooltips, and clean UI

---

## 📦 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Headless UI, Framer Motion, Day.js
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT cookies, session handling via context
- **Deployment:** (Planned) Vercel for frontend, Render for backend

---

## 🛠 Setup

```bash
# Frontend
cd biga-pizza-frontend
npm install
npm run dev

# Backend
cd ../biga-pizza-backend
npm install
npm run dev
```

Make sure MongoDB is running locally or use a remote cluster with your .env properly configured.

⸻

📌 To Do
• Admin dashboard features
• Image upload for user avatars
• Timezone handling & iCal export
• Pizza menu customization
• Recipe sharing / public view
• Mobile UI optimization

⸻

🧑‍🍳 Author

Built by Daiden Sacha with help from Harry (aka ChatGPT), one pizza at a time.
