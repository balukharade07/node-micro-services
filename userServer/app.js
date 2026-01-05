import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.routes.js';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import { createServer } from "http";
import { initializationSocket } from './src/util/socket.js';
import connectionRouter from './src/routes/connection.routes.js';

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
app.use('', connectionRouter);
const server = createServer(app);
initializationSocket(server);

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`User Server running on port ${process.env.PORT}`);
  });
});
