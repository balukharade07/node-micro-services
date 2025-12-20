import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';

dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Auth Server running on port ${process.env.PORT}`);
});
