const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter["shippingAddress.receiverName"] = { $regex: req.query.search, $options: "i" };
    }

    const total = await Order.countDocuments(filter);
    const data = await Order.find(filter)
      .populate("user", "fullName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ message: "OK", page, limit, total, totalPages: Math.ceil(total / limit), data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const data = await Order.findById(req.params.id)
      .populate("user", "fullName email phone")
      .populate("items.product", "name price image");
    if (!data) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && data.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });
    return res.status(200).json({ message: "OK", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* Customer dat hang -> status=pending, paymentStatus=unpaid */
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) return res.status(400).json({ message: "Thieu thong tin giao hang" });
    const requiredAddrFields = ["receiverName", "receiverPhone", "street", "district", "city"];
    for (const field of requiredAddrFields) {
      if (!shippingAddress[field] || !String(shippingAddress[field]).trim())
        return res.status(400).json({ message: "Thieu thong tin: " + field });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price discountPrice stock isActive");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Gio hang trong" });

    /* Kiem tra ton kho + san pham con hoat dong */
    for (const item of cart.items) {
      const prod = item.product;
      if (!prod.isActive) return res.status(400).json({ message: "San pham \"" + item.productName + "\" da ngung ban" });
      if (prod.stock < item.quantity) return res.status(400).json({ message: "San pham \"" + item.productName + "\" chi con " + prod.stock + " san pham" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const order = await Order.create({
      user: userId,
      shippingAddress,
      items,
      totalAmount: cart.totalAmount,
      discountAmount: 0,
      finalAmount: cart.totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "unpaid",  /* FIX: luon unpaid, admin confirm moi paid */
      status: "pending",
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity, soldQuantity: item.quantity } });
    }
    await Cart.findByIdAndDelete(cart._id);

    return res.status(201).json({ message: "Dat hang thanh cong", data: order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* Admin confirm don hang -> complete + paid */
const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "completed", paymentStatus: "paid" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Da xac nhan don hang thanh cong", data: order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* Admin cap nhat status bat ky (neu can) */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Trang thai khong hop le" });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Da cap nhat trang thai", data: order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const data = await Order.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Xoa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, confirmOrder, updateOrderStatus, deleteOrder, getMyOrders };
