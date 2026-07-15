const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controller/orderController');

const OrderRouter = express.Router();

OrderRouter.get('/', getAllOrders);
OrderRouter.get('/:id', getOrderById);
OrderRouter.post('/', createOrder);
OrderRouter.put('/:id', updateOrder);
OrderRouter.delete('/:id', deleteOrder);

module.exports = OrderRouter;
