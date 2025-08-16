// utils/generateToken.js (you already have)
import jwt from 'jsonwebtoken';
export const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
