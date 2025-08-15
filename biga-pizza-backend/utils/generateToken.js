// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const id = user._id?.toString?.() || user.id?.toString?.(); // normalize to string

  return jwt.sign(
    {
      id, // always 'id' (string)
      name: user.name,
      tokenVersion: user.tokenVersion || 0,
      // omit email for smaller/safer token unless you really need it
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
