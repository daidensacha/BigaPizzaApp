# Biga Pizza Backend

Node.js / Express backend API for the **Biga Pizza** application.
This backend is designed to pair directly with the **biga-pizza-frontend** and shares the same configuration philosophy.

---

## Tech Stack

- **Node.js** (Express)
- **MongoDB** (Atlas or local)
- **JWT Authentication**
- **Email**: Mailtrap (development), SendGrid or SMTP (production)
- **Config Management**: Phase (recommended) or `.env` files

---

## Getting Started

```bash
git clone https://github.com/daidensacha/biga-pizza-backend.git
cd biga-pizza-backend
npm install
```

---

## Configuration (choose one)

The backend supports **the same configuration model as the frontend**.

### Option A — Phase (recommended)

Phase is the preferred and documented approach for all Biga Pizza projects.

```bash
phase init
```

Set required secrets:

```bash
phase secrets set PORT=5000
phase secrets set MONGO_URI=your_mongodb_uri
phase secrets set JWT_SECRET=your_jwt_secret
phase secrets set NODE_ENV=development
phase secrets set APP_BASE_URL=http://localhost:5173
```

Mail (development example):

```bash
phase secrets set EMAIL_PROVIDER=mailtrap
phase secrets set MAILTRAP_HOST=your_mailtrap_host
phase secrets set MAILTRAP_PORT=your_mailtrap_port
phase secrets set MAILTRAP_USER=your_user
phase secrets set MAILTRAP_PASS=your_password
phase secrets set MAIL_FROM="Biga Pizza <no-reply@bigapizza.local>"
```

Run the server:

```bash
phase run "npm run dev"
```

---

### Option B — `.env` files (fallback / local-only)

If Phase is not used, create environment files manually from example files.

#### `.env.example`
```env
PORT=5000
MONGO_URI=your_mongodb_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### `.env.development.example`
```env
NODE_ENV=development
APP_BASE_URL=http://localhost:5173

EMAIL_PROVIDER=mailtrap
MAILTRAP_HOST=your_mailtrap_smtp_server
MAILTRAP_PORT=your_mailtrap_port
MAILTRAP_USER=your_mailtrap_user_id
MAILTRAP_PASS=your_mailtrap_password

MAIL_FROM="Biga Pizza <no-reply@bigapizza.local>"
```

#### `.env.production.example`
```env
NODE_ENV=production
APP_BASE_URL=https://your-domain.com

EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
MAIL_FROM="Biga Pizza <no-reply@bigapizza.com>"
```

Run locally:

```bash
npm run dev
```

---

## Running the Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The API will be available at:

```
http://localhost:5000
```

---

## Frontend Integration

The frontend expects the backend base URL via:

```env
VITE_API_BASE_URL=http://localhost:5000
```

This is configured in:
- Frontend `.env`
- or frontend Phase secrets

Both projects intentionally share the **same Phase-first workflow**.

---

## Notes on Consistency

- Frontend and backend use **identical env / Phase documentation**
- Phase is always Option A
- `.env` files are a documented fallback
- This keeps the projects clearly related and maintainable long-term

---

## License

MIT
