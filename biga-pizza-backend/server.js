// server.js
import dotenv from 'dotenv';
// import dotenv from 'dotenv-flow';
// import './loadEnv.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import userDefaultsRoutes from './routes/userDefaults.routes.js';
import { verifyEmailTransport } from './utils/emailService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pick the file explicitly: .env.development | .env.production | fallback .env
const envFile = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);
// Load NODE_ENV-specific, then base .env as fallback
dotenv.config({ path: envFile });
dotenv.config();

const app = express();

console.log('Environment:', process.env.NODE_ENV);
console.log('Mongo URI:', process.env.MONGO_URI);
console.log('Email Provider:', process.env.EMAIL_PROVIDER);

// Define once, so you can reuse if needed
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Apply CORS only to API routes
app.use('/api', cors(corsOptions));

// ✅ Parse JSON & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to DB
connectDB();
verifyEmailTransport();

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);
app.use(userDefaultsRoutes); // <-- if these are API routes, consider prefixing with /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
