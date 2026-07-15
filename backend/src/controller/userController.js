const User = require("../models/user");
const jwt = require("jsonwebtoken");

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const validRoles = ["customer", "staff", "admin"];
const dataUrlImageRegex = /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/;
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^[0-9+\-\s()]{9,15}$/;

const sendValidationErrors = (res, errors) =>
  res.status(400).json({ message: "Validation failed", errors });

const normalizeUserPayload = (body, options = {}) => {
  const { requireEmail = false, requirePassword = false, allowRole = false, allowStatus = false } = options;
  const errors = {};
  const payload = {};

  if (body.fullName !== undefined) {
    const fullName = String(body.fullName || "").trim();
    if (!fullName) errors.fullName = "Full name is required";
    else if (fullName.length < 2 || fullName.length > 80) errors.fullName = "Full name must be 2-80 characters";
    else payload.fullName = fullName;
  }

  if (body.email !== undefined || requireEmail) {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Invalid email format";
    else payload.email = email;
  }

  if (body.password !== undefined || requirePassword) {
    const password = String(body.password || "");
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    else payload.password = password;
  }

  if (body.phone !== undefined) {
    const phone = String(body.phone || "").trim();
    if (phone && !phoneRegex.test(phone)) errors.phone = "Invalid phone number";
    else payload.phone = phone;
  }

  if (body.avatar !== undefined) {
    const avatar = String(body.avatar || "").trim();
    if (avatar && !dataUrlImageRegex.test(avatar)) errors.avatar = "Avatar must be a PNG, JPG, JPEG, or WEBP image";
    else if (avatar.length > 1024 * 1024) errors.avatar = "Avatar image is too large";
    else payload.avatar = avatar;
  }

  if (allowRole && body.role !== undefined) {
    if (!validRoles.includes(body.role)) errors.role = "Invalid role value";
    else payload.role = body.role;
  }

  if (allowStatus && body.isActive !== undefined) {
    payload.isActive = body.isActive === true || body.isActive === "true";
  }

  return { payload, errors };
};

const register = async (req, res) => {
  try {
    const { payload, errors } = normalizeUserPayload(req.body, {
      requireEmail: true,
      requirePassword: true,
    });
    if (!payload.fullName) errors.fullName = "Full name is required";
    if (Object.keys(errors).length) return sendValidationErrors(res, errors);

    const exists = await User.findOne({ email: payload.email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      ...payload,
      addresses: req.body.addresses,
    });
    const token = genToken(user._id);
    return res.status(201).json({ message: "Register success", token, data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isActive)
      return res.status(403).json({ message: "Account is disabled" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    const token = genToken(user._id);
    return res.status(200).json({ message: "Login success", token, data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({ message: "Get profile success", data: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const { payload: updates, errors } = normalizeUserPayload(req.body);
    if (req.body.addresses !== undefined) updates.addresses = req.body.addresses;
    if (Object.keys(errors).length) return sendValidationErrors(res, errors);
    if (Object.keys(updates).length === 0)
      return res.status(400).json({ message: "No valid fields to update" });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    return res.status(200).json({ message: "Update profile success", data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || "";
    const filter = {};

    if (keyword) {
      filter.$or = [
        { fullName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    if (req.query.role) {
      if (req.query.role === "employee") filter.role = { $in: ["staff", "admin"] };
      else if (validRoles.includes(req.query.role)) filter.role = req.query.role;
    }

    const total = await User.countDocuments(filter);
    const data = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      message: "Get all users successfully",
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

const getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id).select("-password");
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Get user successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { payload, errors } = normalizeUserPayload(req.body, {
      requireEmail: true,
      requirePassword: true,
      allowRole: true,
      allowStatus: true,
    });
    if (!payload.fullName) errors.fullName = "Full name is required";
    if (!payload.role) payload.role = "customer";
    if (Object.keys(errors).length) return sendValidationErrors(res, errors);

    const exists = await User.findOne({ email: payload.email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const data = await User.create(payload);
    return res.status(201).json({ message: "Create user successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const isSelf = req.params.id === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (isSelf && !isAdmin) {
      const { payload: updates, errors } = normalizeUserPayload(req.body);
      if (req.body.addresses !== undefined) updates.addresses = req.body.addresses;
      if (Object.keys(errors).length) return sendValidationErrors(res, errors);
      if (Object.keys(updates).length === 0)
        return res.status(400).json({ message: "No valid fields to update" });

      const data = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");
      return res.status(200).json({ message: "Update profile success", data });
    }

    if (isAdmin) {
      const current = await User.findById(req.params.id);
      if (!current) return res.status(404).json({ message: "User not found" });

      const { payload: updates, errors } = normalizeUserPayload(req.body, {
        allowRole: true,
        allowStatus: true,
      });

      if (req.body.email !== undefined && updates.email !== current.email) {
        const exists = await User.findOne({ email: updates.email, _id: { $ne: current._id } });
        if (exists) errors.email = "Email already exists";
      }

      if (Object.keys(errors).length) return sendValidationErrors(res, errors);
      if (Object.keys(updates).length === 0)
        return res.status(400).json({ message: "No valid fields to update" });

      if (updates.password) {
        current.password = updates.password;
        delete updates.password;
        Object.assign(current, updates);
        await current.save();
        const saved = await User.findById(current._id).select("-password");
        return res.status(200).json({ message: "Update user successfully", data: saved });
      }

      const data = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");
      return res.status(200).json({ message: "Update user successfully", data });
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    ).select("-password");
    if (!data) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Disable user successfully", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const validateAddressPayload = (body) => {
  const required = ["receiverName", "receiverPhone", "street", "district", "city"];
  const errors = {};
  required.forEach((field) => {
    if (!String(body[field] || "").trim()) errors[field] = `${field} is required`;
  });
  if (body.receiverPhone && !phoneRegex.test(String(body.receiverPhone).trim())) {
    errors.receiverPhone = "Invalid phone number";
  }
  return errors;
};

const addAddress = async (req, res) => {
  try {
    const errors = validateAddressPayload(req.body);
    if (Object.keys(errors).length) return sendValidationErrors(res, errors);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { receiverName, receiverPhone, street, district, city } = req.body;
    const newAddress = {
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      street: street.trim(),
      district: district.trim(),
      city: city.trim(),
      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const errors = validateAddressPayload(req.body);
    if (Object.keys(errors).length) return sendValidationErrors(res, errors);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    address.receiverName = req.body.receiverName.trim();
    address.receiverPhone = req.body.receiverPhone.trim();
    address.street = req.body.street.trim();
    address.district = req.body.district.trim();
    address.city = req.body.city.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    const wasDefault = address.isDefault;
    address.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
    address.isDefault = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
