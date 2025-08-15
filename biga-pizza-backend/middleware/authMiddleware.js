// middleware/protect.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  // Accept case-insensitive Bearer
  const auth = req.headers.authorization || '';
  if (!token && auth.toLowerCase().startsWith('bearer ')) {
    token = auth.slice(7).trim();
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { id, name?, tokenVersion? }

    // Load fresh tokenVersion from DB
    const user = await User.findById(decoded.id).select('_id tokenVersion');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if ((user.tokenVersion || 0) !== (decoded.tokenVersion || 0)) {
      return res
        .status(401)
        .json({ message: 'Token expired, please log in again' });
    }

    // Keep req.user minimal and normalized
    req.user = {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion || 0,
    };

    next();
  } catch (err) {
    console.error('JWT Verify Error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;
