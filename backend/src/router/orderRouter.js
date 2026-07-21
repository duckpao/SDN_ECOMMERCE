const express = require('express');
const {
  checkout,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} = require('../controller/orderController');
const { auth } = require('../middleware/auth');

const OrderRouter = express.Router();

OrderRouter.get('/', getAllOrders);
OrderRouter.get('/my-orders', auth, getMyOrders);
OrderRouter.post('/checkout', auth, checkout);
OrderRouter.get('/:id', getOrderById);
OrderRouter.post('/', auth, createOrder);
OrderRouter.put('/:id', updateOrder);
OrderRouter.delete('/:id', deleteOrder);

module.exports = OrderRouter;
