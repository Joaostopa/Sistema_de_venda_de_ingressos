const express = require('express');
const router = express.Router();
const TicketType = require('../models/ticketType');
const Purchase = require('../models/purchase');
const { authenticateToken } = require('../middlewares/auth');

router.post('/', authenticateToken, async (req, res) => {

  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Nenhum item informado' });
  }

  try {
    for (const item of items) {
      const ticket = await TicketType.findById(item.ticketTypeId);
      if (!ticket)
        return res.status(404).json({ error: 'Tipo de ingresso não encontrado' });
      if (ticket.stock < item.quantity)
        return res.status(400).json({ error: `Estoque insuficiente para o ingresso: ${ticket.name}` });


      ticket.stock -= item.quantity;
      await ticket.save();


      const purchase = new Purchase({
        user: req.user.id,
        ticketType: ticket._id,
        quantity: item.quantity,
      });
      await purchase.save();
    }
    res.json({ message: 'Compra realizada com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
