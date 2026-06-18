import jwt from 'jsonwebtoken';

const TOKEN_EXPIRY = '1h';

function getSecret() {
  return process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
}

export function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
    getSecret(),
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

export default function authMiddleware(req, res, next) {
  if (req.originalUrl.includes('/api/documents/sign')) {
    return next();
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ msg: 'Niet geautoriseerd — geen token' });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Niet geautoriseerd — ongeldige token' });
  }
}
