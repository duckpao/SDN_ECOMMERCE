const Category = require('../models/category');

const getAllCategorys = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || "";
    const filter = { isActive: true };
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    const total = await Category.countDocuments(filter);
    const data = await Category.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      message: 'Get all categories successfully',
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

const getCategoryById = async (req, res) => {
  try {
    const data = await Category.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json({ message: 'Get category successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // 1. Kiểm tra xem category đã tồn tại trong database chưa (dựa theo trường name)
    const existingCategory = await Category.findOne({ name: name });

    // 2. Nếu đã tồn tại, lập tức chặn và trả về lỗi 400
    if (existingCategory) {
      return res.status(400).json({ message: "Category name is existed" });
    }

    // 3. Nếu chưa tồn tại, tiến hành tạo mới
    const data = await Category.create(req.body);
    return res.status(201).json({ message: 'Create category successfully', data });
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json({ message: 'Update category successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!data) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json({ message: "Disable category successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
