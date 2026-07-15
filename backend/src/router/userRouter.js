const express = require('express');
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser,
  register, login, getProfile, updateProfile,
} = require('../controller/userController');
const { auth, authorize } = require('../middleware/auth');

const UserRouter = express.Router();

// Public auth routes
UserRouter.post('/register', register);
UserRouter.post('/login', login);

// Protected profile routes
UserRouter.get('/profile', auth, getProfile);
UserRouter.put('/profile', auth, updateProfile);

// Admin-only user management
UserRouter.get('/', auth, authorize('admin'), getAllUsers);
UserRouter.get('/:id', auth, getUserById);
UserRouter.post('/', auth, authorize('admin'), createUser);
UserRouter.put('/:id', auth, updateUser);
UserRouter.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = UserRouter;