const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Payment = require('../models/payment');

const checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;
    const requiredAddressFields = ['receiverName', 'receiverPhone', 'street', 'district', 'city'];

    if (!shippingAddress || requiredAddressFields.some((field) => !String(shippingAddress[field] || '').trim())) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ địa chỉ giao hàng' });
    }
    if (!['COD', 'BANKING', 'MOMO'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
    }

    const cart = await Cart.findOne({ user: req.user._id, isActive: true }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng đang trống' });
    }

    const items = [];
    let totalAmount = 0;
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Sản phẩm ${cartItem.productName} không còn được bán` });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho` });
      }

      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const subtotal = unitPrice * cartItem.quantity;
      totalAmount += subtotal;
      items.push({
        product: product._id,
        productName: product.name,
        unitPrice,
        quantity: cartItem.quantity,
        subtotal,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      items,
      totalAmount,
      finalAmount: totalAmount,
      paymentMethod,
      paymentStatus: 'unpaid',
    });

    await Promise.all(items.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })));
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      method: paymentMethod,
      amount: totalAmount,
      status: 'pending',
    });
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({ message: 'Đặt hàng thành công', data: { order, payment } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
  checkout,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
};
