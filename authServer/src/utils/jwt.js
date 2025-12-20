import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyJWTToken = async (req, res, next) => {
  try {
    
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ error: 'Invalid or expired token' });
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error('User is not found');
    }
    const activeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
    req.user = activeUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token', error });
  }
};

export const getLoggedInUser = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    const activeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
    req.user = activeUser;
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
};

export const verifyJWTTokenFromOtherServerCall = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized Token.....' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token/expier.....' });
  }
};
