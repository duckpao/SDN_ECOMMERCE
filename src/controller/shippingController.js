const Shipping = require('../models/shipping');

const getAllShippings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const total = await Shipping.countDocuments(filter);
    const data = await Shipping.find(filter).populate('order', 'finalAmount status shippingAddress').skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all shippings successfully',
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

const getShippingById = async (req, res) => {
  try {
    const data = await Shipping.findById(req.params.id).populate('order', 'finalAmount status shippingAddress');
    if (!data) return res.status(404).json({ message: 'Shipping not found' });
    return res.status(200).json({ message: 'Get shipping successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createShipping = async (req, res) => {
  try {
    const data = await Shipping.create(req.body);
    return res.status(201).json({ message: 'Create shipping successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateShipping = async (req, res) => {
  try {
    const data = await Shipping.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Shipping not found' });
    return res.status(200).json({ message: 'Update shipping successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteShipping = async (req, res) => {
  try {
    const data = await Shipping.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Shipping not found' });
    return res.status(200).json({ message: 'Delete shipping successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllShippings,
  getShippingById,
  createShipping,
  updateShipping,
  deleteShipping,
};
