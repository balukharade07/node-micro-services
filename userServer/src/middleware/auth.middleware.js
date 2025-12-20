import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.cookies;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const cookies = req.cookies;
  const { token } = cookies;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
