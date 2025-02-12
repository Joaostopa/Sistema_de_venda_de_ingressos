require("dotenv").config();

const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const mongoose = require("mongoose");
const { authenticateToken } = require("./middlewares/auth");

const app = express();

const engine = mustacheExpress();
app.engine("mustache", engine);
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "templates"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const purchaseRoutes = require("./routes/purchases");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/", async (req, res) => {
  const tickets = await mongoose.model("TicketType").find();
  res.render("home", { titulo: "Sistema de Ingressos", tickets });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register", { titulo: "Cadastro" });
  });
  

app.get("/purchases", authenticateToken, async (req, res) => {
  const purchases = await mongoose
    .model("Purchase")
    .find({ user: req.user.id })
    .populate("ticketType");
  res.render("purchaseHistory", { purchases });
});

app.get("/purchases/:id", authenticateToken, async (req, res) => {
  const purchase = await mongoose
    .model("Purchase")
    .findById(req.params.id)
    .populate("ticketType");

  if (!purchase || purchase.user.toString() !== req.user.id) {
    return res.status(403).send("Acesso negado");
  }

  res.render("ticketDetail", purchase);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
