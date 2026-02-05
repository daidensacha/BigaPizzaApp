# Biga Pizza Frontend (Vite + React)

Frontend for the **Biga Pizza App**, built with **Vite + React**.
This project communicates with a separate backend API and supports both
classic `.env` files and **Phase** for environment variable management.

---

## Tech Stack

- Vite 5
- React 18
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Headless UI / Radix UI

---

## Getting Started

### Prerequisites

- Node.js **18+** recommended
- npm (or pnpm / yarn)
- Backend API running locally or remotely

---

## Installation

```bash
git clone https://github.com/daidensacha/biga-pizza-frontend.git
cd biga-pizza-frontend

npm install
```

---

## Environment Configuration

### Option A — `.env` file (simple local setup)

Create a `.env` file in the project root:

```env
# Backend base URL
VITE_API_BASE_URL=http://localhost:5000

# Cloudinary unsigned upload (frontend-safe)
VITE_CLOUD_NAME=your_cloud_name
VITE_UPLOAD_PRESET=your_unsigned_upload_preset
```

Notes:

- Only variables prefixed with `VITE_` are exposed to the browser
- Never commit real secrets
- `.env` should be gitignored

---

### Option B — Phase (recommended)

This project works cleanly with **Phase** for managing environment variables.

Example:

```bash
phase init
phase secrets set VITE_API_BASE_URL=http://localhost:5000
phase secrets set VITE_CLOUD_NAME=your_cloud_name
phase secrets set VITE_UPLOAD_PRESET=your_unsigned_upload_preset

phase run "npm run dev"
```

Benefits:

- No `.env` files committed
- Centralised secret management
- Matches backend Phase workflow

---

## Running the App

### Development

```bash
npm run dev
```

App will be available at:

```
http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Upgrade Path (Recommended)

### Node.js

- Current: Node 18
- Future:
  - Node 20 LTS
  - Node 22 (when ecosystem stabilises)

### Dependencies

- Keep Vite, React, and Router updated together
- Upgrade in this order:
  1. Node
  2. Vite
  3. React
  4. Tailwind / UI libs

### Strategy

- Use `npm outdated`
- Upgrade in small batches
- Test routing and animations carefully after upgrades

---

## Notes

- This frontend assumes the backend handles authentication & persistence
- Designed to work with the **Biga Pizza backend API**
- Intended as part of a larger full-stack project

---

## License

MIT
