// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // or your frontend URL
    credentials: true, // ✅ allow cookies to be sent
  }),
);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
