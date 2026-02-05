# 🍕 Biga Pizza App

![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Database](https://img.shields.io/badge/database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**A full-stack pizza dough calculator and recipe manager**
Built to combine artisan pizza baking precision with modern web technology.
Easily calculate dough formulas, plan fermentation schedules, and store your recipes securely.

---

## 📖 Overview

The **Biga Pizza App** is a **React + Node.js + MongoDB** application for pizza enthusiasts and professionals.
It allows users to:

- Create and customize pizza dough recipes (including Biga and Refresh stages)
- Automatically calculate ingredient quantities based on baker’s percentages
- Plan fermentation timelines with interactive scheduling
- Save, edit, and delete recipes with secure authentication
- Access recipes from any device via a clean, responsive UI

---

## 🛠 Tech Stack

**Frontend**

- ⚛️ React (Vite)
- 🎨 Tailwind CSS + Dark Mode
- 🎭 Framer Motion (animations)
- 🧭 React Router DOM

**Backend**

- 🟢 Node.js & Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication & Protected Routes

**Other Tools**

- 📦 Axios
- 📅 Day.js
- 🍞 React Hot Toast (notifications)

---

## 🚀 Features

- **Guided Input Flow** → Step-by-step recipe creation with validation
- **Modal Recipe Editor** → Edit without leaving the recipe detail page
- **User Dashboard** → View saved recipes, defaults, and profile info
- **Dark/Light Theme** → Automatic and manual theme switching
- **Responsive UI** → Fully mobile-friendly

---

## 📸 Screenshots

### Dashboard (Dark Mode)

![Dashboard Dark](https://github.com/daidensacha/BigaPizzaApp/blob/main/biga-pizza-frontend/public/images/screenshots/dashboard-dark.jpg?raw=true)

### Guided Input Flow

![Guided Flow](https://github.com/daidensacha/BigaPizzaApp/blob/main/biga-pizza-frontend/public/images/screenshots/guided-flow.jpg?raw=true)

### Recipe Detail

![Recipe Detail](https://github.com/daidensacha/BigaPizzaApp/blob/main/biga-pizza-frontend/public/images/screenshots/recipe-detail.jpg?raw=true)

---

## 🔐 Environment Variables & Secrets (Phase-first)

This project uses **Phase** as the primary mechanism for managing environment variables.

### Why Phase?
- No committed secrets
- Same workflow for frontend & backend
- Easy switching between Development / Production

Each sub-project can still run **without Phase** using `.env` files if required,
but Phase is the recommended default.

---

## ▶️ Running the Project (Recommended)

### 1. Authenticate with Phase

```bash
phase auth
```

### 2. Frontend (Vite)

```bash
cd biga-pizza-frontend
phase run "npm run dev"
```

Frontend runs at: http://localhost:5173

### 3. Backend (Express)

```bash
cd biga-pizza-backend
phase run "npm run dev"
```

Backend runs at: http://localhost:5000

---

## 🧪 Local Development Without Phase (Optional)

Each sub-project includes:

- `.env.example`
- `.env.development.example`
- `.env.production.example`

If you prefer `.env` files:

```bash
cp .env.example .env
```

Then run normally:

```bash
npm run dev
```

> ⚠️ Do **not** commit `.env` files.

---

## 🤝 Contributing

Contributions, feedback, and pizza memes are welcome.
Open an issue or discussion to get started!

## 🛠 Roadmap

- [ ] Recipe print/PDF export
- [ ] Countdown baking timer ⏳
- [ ] Achievement badges 🎖️
- [ ] Admin dashboard (users, recipes, defaults)
- [ ] Multi-language support 🌍

## 🏷️ Issue Labels

We use labels to keep issues organized and easy to track:

| Label                | Description                               |
| -------------------- | ----------------------------------------- |
| **frontend**         | React, UI, Tailwind, animations           |
| **backend**          | Node, Express, MongoDB, API routes        |
| **database**         | Schema, migrations, queries               |
| **auth**             | Login, registration, sessions, cookies    |
| **dashboard**        | User or admin dashboards                  |
| **ui/ux**            | Styling, layout, interactions             |
| **feature**          | New functionality requests                |
| **enhancement**      | Improvements to existing features         |
| **bug**              | Something broken                          |
| **docs**             | Documentation or README updates           |
| **good first issue** | Easy wins for newcomers                   |
| **discussion**       | Brainstorming ideas or planning           |
| **blocked**          | Waiting on something else before progress |

**Color scheme suggestion:**

- 🍅 **Red** → `bug`
- 🍕 **Yellow** → `feature`
- 🍃 **Green** → `enhancement`
- 📘 **Blue** → docs & discussions
- 🟣 **Purple** → auth, dashboard, frontend/backend categories

---

---

## 🌐 Connect

- **LinkedIn:** [Daiden Sacha](https://www.linkedin.com/in/daidensacha)
- **GitHub:** [github.com/daidensacha](https://github.com/daidensacha)

---

## 📜 License

MIT License — feel free to fork and adapt.

---

> _“Code is like pizza dough — it’s all about how you shape it.”_
