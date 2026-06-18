const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
  avatar: String,
  addresses: [addressSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
