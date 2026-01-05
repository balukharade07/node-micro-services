import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
  connectionRequestReceived,
  connectionRequestReview,
  connectionRequestSend,
  getConnections,
  getFeed,
  getOnlineUser,
} from '../controllers/connection.controller.js';

const connectionRouter = express.Router();

connectionRouter.post(
  '/request/send/:status/:toUserId',
  verifyToken,
  connectionRequestSend,
);

connectionRouter.post(
  '/request/review/:status/:requestId',
  verifyToken,
  connectionRequestReview,
);

connectionRouter.post(
  '/user/requests/received',
  verifyToken,
  connectionRequestReceived,
);

connectionRouter.post('/user/connections', verifyToken, getConnections);

connectionRouter.post('/feed', verifyToken, getFeed);
connectionRouter.post('/user/onlineUsers',verifyToken, getOnlineUser);

export default connectionRouter;
