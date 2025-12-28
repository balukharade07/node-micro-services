import express from 'express';
import { deleteProfile, getChat, getProfile, updateProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getProfile);
router.patch('/:id', verifyToken, updateProfile);
router.delete('/:id', verifyToken, deleteProfile);
router.get('/chat/:id', verifyToken, getChat);

export default router;
