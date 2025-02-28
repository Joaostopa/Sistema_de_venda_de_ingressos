const mongoose = require("mongoose");

const TicketTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },  
});

module.exports = mongoose.model("TicketType", TicketTypeSchema);
