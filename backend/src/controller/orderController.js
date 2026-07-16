const Order = require('../models/order');

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const total = await Order.countDocuments(filter);
    const data = await Order.find(filter).populate('user', 'fullName email phone').skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all orders successfully',
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

const getOrderById = async (req, res) => {
  try {
    const data = await Order.findById(req.params.id).populate('user', 'fullName email phone');
    if (!data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Get order successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const data = await Order.create(req.body);
    return res.status(201).json({ message: 'Create order successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const data = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Update order successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const data = await Order.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Delete order successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
};
