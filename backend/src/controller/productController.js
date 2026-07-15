const Product = require('../models/product');

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter).populate('category', 'name').populate('brand', 'name').skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all products successfully',
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

const getProductById = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id).populate('category', 'name').populate('brand', 'name');
    if (!data) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Get product successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = await Product.create(req.body);
    return res.status(201).json({ message: 'Create product successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Update product successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Delete product successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
