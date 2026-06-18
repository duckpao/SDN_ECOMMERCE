const express = require('express');
const {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} = require('../controller/cartController');

const CartRouter = express.Router();

CartRouter.get('/', getAllCarts);
CartRouter.get('/:id', getCartById);
CartRouter.post('/', createCart);
CartRouter.put('/:id', updateCart);
CartRouter.delete('/:id', deleteCart);

module.exports = CartRouter;
