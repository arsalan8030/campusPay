import { verify } from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, email
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
