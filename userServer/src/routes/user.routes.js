import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getProfile);
router.patch('/:id', verifyToken, updateProfile);

export default router;
