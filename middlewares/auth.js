const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_here';

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não informado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin')
    return res.status(403).json({ error: 'Apenas administradores podem executar essa ação' });
  next();
}

module.exports = { authenticateToken, isAdmin, JWT_SECRET };
