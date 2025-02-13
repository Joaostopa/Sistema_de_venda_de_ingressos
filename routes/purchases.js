const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');
const TicketType = require('../models/ticketType');
const { authenticateToken } = require('../middlewares/auth');


router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user.id;

    console.log("🔹 Usuário autenticado para compra:", user);

    for (const item of items) {
      const ticket = await TicketType.findById(item.ticketTypeId);
      if (!ticket) {
        return res.status(404).json({ error: "Ingresso não encontrado" });
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
