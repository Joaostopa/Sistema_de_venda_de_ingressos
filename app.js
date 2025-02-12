require("dotenv").config(); 

const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const mongoose = require("mongoose");

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


app.get("/", (req, res) => {
  res.render("home", { titulo: "Sistema de Ingressos", descricao: "Venda e controle de ingressos de forma fácil!" });
});


app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/purchases", (req, res) => {
  res.render("purchaseHistory", { purchases: [] });
});

app.get("/purchases/:id", (req, res) => {
  res.render("ticketDetail", { ticketType: { name: "VIP" }, quantity: 1, purchaseDate: "2024-02-12" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
