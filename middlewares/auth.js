const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("❌ Nenhum cabeçalho de autorização encontrado");
    return res.status(401).json({ error: "Token não informado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Token recebido:", token);

  if (!token) return res.status(401).json({ error: "Token não informado" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token inválido:", err);
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = user;
    console.log("✅ Usuário autenticado:", user);
    next();
  });
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar essa ação." });
  }
  next();
}

module.exports = { authenticateToken, isAdmin };
