const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  shipperName: String,
  shipperPhone: String,
  status: {
    type: String,
    enum: ['waiting', 'picked_up', 'delivering', 'delivered', 'failed'],
    default: 'waiting',
  },
  shippedAt: Date,
  deliveredAt: Date,
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Shipping', shippingSchema);
