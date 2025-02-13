const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  console.log("Token recebido:", token);  

  if (!token) return res.status(401).json({ error: "Token não informado" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    req.user = user;
    next(); 
  });
}

app.get("/buy/:id", authenticateToken, async (req, res) => {
  try {
    const ticket = await TicketType.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ingresso não encontrado");
    res.render("buy", { ticket });
  } catch (err) {
    console.error("Erro ao carregar ingresso:", err);
    res.status(500).send("Erro ao carregar ingresso");
  }
});



function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar essa ação." });
  }
  next();  
}

module.exports = { authenticateToken, isAdmin };
