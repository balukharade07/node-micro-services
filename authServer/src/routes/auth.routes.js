import express from 'express';
import {
  deleteUser,
  forgotPassword,
  getUser,
  getUsers,
  loggedInUser,
  login,
  logout,
  resetPassword,
  signupUser,
  userUpdate,
} from '../controllers/auth.controller.js';
import { getLoggedInUser, verifyJWTToken, verifyJWTTokenFromOtherServerCall } from '../utils/jwt.js';
import {
  handleUpdatedUserCalidation,
  handleValidation,
  loginValidation,
  userRegisterValidation,
} from '../utils/validations.js';

const router = express.Router();

router.post('/signup', userRegisterValidation, handleValidation, signupUser);
router.post('/login', loginValidation, handleValidation, login);
router.get('/isLoggendIn', getLoggedInUser, loggedInUser);
router.post('/forgotPassword/:email', forgotPassword);
router.patch('/resetPassword/:_id', resetPassword);
router.post('/logout', logout);
//user Server throw call

router.get('/users', verifyJWTToken, getUsers);
router.delete('/userDelete/:_id', verifyJWTToken, deleteUser);
router.patch(
  '/user/:_id',
  verifyJWTToken,
  handleUpdatedUserCalidation,
  userUpdate,
);
router.get('/user/:_id', verifyJWTTokenFromOtherServerCall, getUser);

export default router;
