import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`User Server running on port ${process.env.PORT}`);
  });
});
