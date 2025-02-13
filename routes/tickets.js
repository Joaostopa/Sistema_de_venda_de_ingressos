const express = require("express");
const router = express.Router();
const TicketType = require("../models/ticketType");
const { authenticateToken, isAdmin } = require("../middlewares/auth");


router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const ticketType = new TicketType({ name, price, stock });
    await ticketType.save();
    res.status(201).json(ticketType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const tickets = await TicketType.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const ticket = await TicketType.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado" });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const ticket = await TicketType.findByIdAndUpdate(
      req.params.id,
      { name, price, stock },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado" });

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const ticket = await TicketType.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ingresso não encontrado" });

    res.json({ message: "Ingresso removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
