require("dotenv").config();
const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const mongoose = require("mongoose");
const { authenticateToken } = require("./middlewares/auth");
const TicketType = require("./models/ticketType");

const app = express();


const engine = mustacheExpress();
app.engine("mustache", engine);
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "templates"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const purchaseRoutes = require("./routes/purchases");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchases", purchaseRoutes);

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000, 
}).then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

app.get("/", async (req, res) => {
  try {
    const tickets = await TicketType.find(); 
    res.render("home", { titulo: "Sistema de Ingressos", tickets });
  } catch (error) {
    console.error("Erro ao carregar ingressos:", error);
    res.status(500).send("Erro ao carregar ingressos");
  }
});

app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));

app.get("/purchases", authenticateToken, async (req, res) => {
  try {
    res.render("purchaseHistory");
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    res.status(500).send("Erro ao carregar histórico");
  }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
