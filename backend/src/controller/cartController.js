const Cart = require('../models/cart');

const getAllCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || "";
    const filter = { isActive: true };
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    const total = await Cart.countDocuments(filter);
    const data = await Cart.find(filter).populate('user', 'fullName email').populate('items.product', 'name price image').skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all carts successfully',
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

const getCartById = async (req, res) => {
  try {
    const data = await Cart.findById(req.params.id).populate('user', 'fullName email').populate('items.product', 'name price image');
    if (!data) return res.status(404).json({ message: 'Cart not found' });
    return res.status(200).json({ message: 'Get cart successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const data = await Cart.create(req.body);
    return res.status(201).json({ message: 'Create cart successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const data = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Cart not found' });
    return res.status(200).json({ message: 'Update cart successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const data = await Cart.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!data) return res.status(404).json({ message: 'Cart not found' });
    return res.status(200).json({ message: "Disable cart successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
