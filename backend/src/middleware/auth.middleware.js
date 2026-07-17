import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token ausente.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido.' });
  }
}
