const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");

// User: checkout — create order from cart
const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.receiverName || !shippingAddress.receiverPhone || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: "Thieu thong tin dia chi nhan hang" });
    }

    const cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Gio hang trong" });
    }

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const totalAmount = cart.totalAmount;
    const discountAmount = 0;
    const finalAmount = totalAmount - discountAmount;

    const order = await Order.create({
      user: userId,
      shippingAddress,
      items: cart.items,
      totalAmount,
      discountAmount,
      finalAmount,
      paymentMethod: paymentMethod || "COD",
      status: "pending",
      paymentStatus: "unpaid",
    });

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({ message: "Dat hang thanh cong", data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trang thai khong hop le" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })
      .populate("user", "fullName email phone");
    if (!order) return res.status(404).json({ message: "Don hang khong ton tai" });

    // If completed, update payment status to paid
    if (status === "completed") {
      order.paymentStatus = "paid";
      await order.save();
    }

    return res.status(200).json({ message: "Cap nhat trang thai thanh cong", data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User: get my orders
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user._id });
    const data = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Get my orders successfully",
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || "";
    const filter = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

    const total = await Order.countDocuments(filter);
    const data = await Order.find(filter)
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Get all orders successfully",
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const data = await Order.findById(req.params.id).populate("user", "fullName email phone");
    if (!data) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Get order successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// (keep createOrder/updateOrder for admin fallback but not needed)
const createOrder = async (req, res) => {
  try {
    const data = await Order.create(req.body);
    return res.status(201).json({ message: "Create order successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const data = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Update order successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const data = await Order.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Delete order successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkout,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};