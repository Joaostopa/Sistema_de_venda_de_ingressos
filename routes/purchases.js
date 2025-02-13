const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const TicketType = require('../models/ticketType');
const { authenticateToken } = require('../middlewares/auth');


router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("🔹 Token recebido para autenticação:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const purchases = await Purchase.find({ user: req.user.id }).populate('ticketType');

    res.json(purchases);
  } catch (err) {
    console.error("❌ Erro ao buscar compras:", err);
    res.status(500).json({ error: "Erro ao carregar histórico de compras." });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user.id;

    console.log("🔹 Usuário autenticado para compra:", user);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum ingresso selecionado." });
    }

    for (const item of items) {
      const ticket = await TicketType.findById(item.ticketTypeId);
      if (!ticket) {
        return res.status(404).json({ error: "Ingresso não encontrado." });
      }

      if (ticket.stock < item.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para ${ticket.name}` });
      }

      ticket.stock -= item.quantity;
      await ticket.save();

      const purchase = new Purchase({
        user,
        ticketType: item.ticketTypeId,
        quantity: item.quantity
      });
      await purchase.save();
    }

    res.status(201).json({ message: "Compra realizada com sucesso!" });
  } catch (err) {
    console.error("❌ Erro na compra:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
