// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import cookieParser from 'cookie-parser';
import userDefaultsRoutes from './routes/userDefaults.routes.js';

dotenv.config();

const app = express();

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

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use(userDefaultsRoutes); // <-- if these are API routes, consider prefixing with /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
