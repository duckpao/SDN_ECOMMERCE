const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  checkout,
  updateOrderStatus,
} = require('../controller/orderController');
const { auth, authorize } = require('../middleware/auth');

const OrderRouter = express.Router();

// User routes
OrderRouter.post('/checkout', auth, checkout);
OrderRouter.get('/my-orders', auth, getMyOrders);

// Admin routes
OrderRouter.get('/', auth, authorize('admin'), getAllOrders);
OrderRouter.put('/:id/status', auth, authorize('admin'), updateOrderStatus);
OrderRouter.get('/:id', auth, getOrderById);

// Fallback (admin)
OrderRouter.post('/', auth, authorize('admin'), createOrder);
OrderRouter.put('/:id', auth, authorize('admin'), updateOrder);
OrderRouter.delete('/:id', auth, authorize('admin'), deleteOrder);

module.exports = OrderRouter;