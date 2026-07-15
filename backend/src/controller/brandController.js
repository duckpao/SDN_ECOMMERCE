const Brand = require("../models/brand");

const getAllBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || "";
    const filter = { isActive: true };
    if (keyword) filter.name = { $regex: keyword, $options: "i" };

    const total = await Brand.countDocuments(filter);
    const data = await Brand.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      message: "Get all brands successfully",
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

const getBrandById = async (req, res) => {
  try {
    const data = await Brand.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Get brand successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    // Lấy tên brand từ dữ liệu gửi lên (giả sử key trong req.body là 'name')
    const { name } = req.body; 

    // 1. Tìm xem trong database đã có brand nào mang tên này chưa
    const existingBrand = await Brand.findOne({ name: name });

    // 2. Nếu tìm thấy (đã tồn tại), lập tức chặn lại và trả về lỗi 400
    if (existingBrand) {
      return res.status(400).json({ message: "Brand name is existed" });
    }

    // 3. Nếu vượt qua được bước trên (chưa tồn tại), tiến hành tạo mới
    const data = await Brand.create(req.body);
    return res.status(201).json({ message: 'Create brand successfully', data });
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const data = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Update brand successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const data = await Brand.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!data) return res.status(404).json({ message: "Brand not found" });
    return res.status(200).json({ message: "Disable brand successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
