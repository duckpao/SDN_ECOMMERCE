const Cart = require('../models/cart');
const Product = require('../models/product');

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

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // 1. Tìm sản phẩm để lấy giá và kiểm tra tồn kho
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    // 2. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user: userId });

    // Tính toán số lượng hiện tại đang có trong giỏ hàng (nếu có)
    let currentQuantityInCart = 0;
    let itemIndex = -1;

    if (cart) {
      itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        currentQuantityInCart = cart.items[itemIndex].quantity;
      }
    }

    // Số lượng mục tiêu sau khi cộng/trừ thêm
    const targetQuantity = currentQuantityInCart + quantity;

    // --- BẮT ĐẦU VALIDATE SỐ LƯỢNG TỒN KHO ---
    if (targetQuantity > product.stock) {
      return res.status(400).json({
        message: `Không thể thêm! Bạn đã có ${currentQuantityInCart} sản phẩm này trong giỏ hàng, kho chỉ còn tối đa ${product.stock} sản phẩm.`
      });
    }

    if (targetQuantity < 1) {
      return res.status(400).json({ message: 'Số lượng tối thiểu phải là 1' });
    }
    // --- KẾT THÚC VALIDATE ---

    // 3. Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{
          product: productId,
          productName: product.name,
          unitPrice: product.discountPrice > 0 ? product.discountPrice : product.price,
          quantity: quantity,
          subtotal: (product.discountPrice > 0 ? product.discountPrice : product.price) * quantity
        }],
        totalAmount: (product.discountPrice > 0 ? product.discountPrice : product.price) * quantity
      });
      return res.status(201).json({ message: 'Đã thêm vào giỏ hàng', data: cart });
    }

    // 4. Nếu đã có giỏ hàng
    if (itemIndex > -1) {
      // Cập nhật bằng đúng số lượng mục tiêu đã tính toán và validate ở trên
      cart.items[itemIndex].quantity = targetQuantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].quantity * cart.items[itemIndex].unitPrice;
    } else {
      // Thêm mới nếu chưa có
      cart.items.push({
        product: productId,
        productName: product.name,
        unitPrice: product.discountPrice > 0 ? product.discountPrice : product.price,
        quantity: quantity,
        subtotal: (product.discountPrice > 0 ? product.discountPrice : product.price) * quantity
      });
    }

    // 5. Cập nhật lại totalAmount
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    await cart.save();

    return res.status(200).json({ message: 'Đã cập nhật giỏ hàng', data: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image stock'); // <-- Thêm 'stock' vào đây

    if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });
    return res.status(200).json({ data: cart });
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

const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();
    return res.status(200).json({ message: 'Đã xóa sản phẩm', data: cart });
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
  addToCart,
  removeItem,
  getMyCart
};
