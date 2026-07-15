const Payment = require('../models/payment');

const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const total = await Payment.countDocuments(filter);
    const data = await Payment.find(filter).populate('order', 'finalAmount status').populate('user', 'fullName email').skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all payments successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const data = await Payment.findById(req.params.id).populate('order', 'finalAmount status').populate('user', 'fullName email');
    if (!data) return res.status(404).json({ message: 'Payment not found' });
    return res.status(200).json({ message: 'Get payment successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const data = await Payment.create(req.body);
    return res.status(201).json({ message: 'Create payment successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const data = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Payment not found' });
    return res.status(200).json({ message: 'Update payment successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const data = await Payment.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Payment not found' });
    return res.status(200).json({ message: 'Delete payment successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
