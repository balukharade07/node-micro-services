import { Server } from 'socket.io';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Chat from '../models/Chat.js';

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('$'))
    .digest('hex');
};

export const initializationSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error('Authentication error: No cookies found'));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      const room = getSecretRoomId(userId, targetUserId);
      socket.join(room);
    });

    socket.on(
      'sendMessage',
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const room = getSecretRoomId(userId, targetUserId);
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(room).emit('receiveMessage', {
            message: text,
            firstName,
            userId,
            createdAt: new Date(),
          });
        } catch (error) {
          console.log("Authentication error: Invalid token",  error)
        }
      },
    );

    socket.on('disconnect', () => {});
  });

  return io;
};
