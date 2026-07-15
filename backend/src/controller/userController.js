const User = require('../models/user');
const jwt = require('jsonwebtoken');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, addresses } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ fullName, email, password, phone, addresses });
    const token = genToken(user._id);
    return res.status(201).json({ message: 'Register success', token, data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is disabled' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    const token = genToken(user._id);
    return res.status(200).json({ message: 'Login success', token, data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({ message: 'Get profile success', data: req.user });
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ['fullName', 'phone', 'avatar', 'addresses'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    return res.status(200).json({ message: 'Update profile success', data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.search || '';
    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
    const total = await User.countDocuments(filter);
    const data = await User.find(filter).select('-password').skip(skip).limit(limit);
    return res.status(200).json({ message: 'Get all users successfully', page, limit, total, totalPages: Math.ceil(total / limit), data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id).select('-password');
    if (!data) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'Get user successfully', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const data = await User.create(req.body);
    return res.status(201).json({ message: 'Create user successfully', data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const isSelf = req.params.id === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Self: update profile fields
    if (isSelf) {
      const allowed = ['fullName', 'phone', 'avatar', 'addresses'];
      const updates = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }
      const data = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
      return res.status(200).json({ message: 'Update profile success', data });
    }

    // Admin: update role of other users
    if (isAdmin) {
      if (!req.body.role) {
        return res.status(400).json({ message: 'Only role can be updated by admin' });
      }
      const validRoles = ['customer', 'staff', 'admin'];
      if (!validRoles.includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role value' });
      }
      const data = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select('-password');
      if (!data) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'Update role successfully', data });
    }

    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'Delete user successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, getAllUsers, getUserById, createUser, updateUser, deleteUser };