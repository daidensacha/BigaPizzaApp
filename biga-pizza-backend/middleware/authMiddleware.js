import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  // 1. Try to get token from cookie
  let token = req.cookies?.token;

  // 2. If not in cookie, try Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name }
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;
