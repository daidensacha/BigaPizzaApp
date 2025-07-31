import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const token = req.cookies.token;

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
