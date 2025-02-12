const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketType: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType', required: true },
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
