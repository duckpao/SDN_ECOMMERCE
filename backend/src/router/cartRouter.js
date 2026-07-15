const express = require('express');
const { auth } = require('../middleware/auth'); // Nhớ import auth
const {
  getAllCarts,
  getCartById,
  createCart,
  addToCart,
  removeItem,
  updateCart,
  deleteCart,
  getMyCart
} = require('../controller/cartController');

const CartRouter = express.Router();

CartRouter.get('/my-cart', auth, getMyCart); // Đặt lên trước /:id
CartRouter.post('/add', auth, addToCart);
CartRouter.delete('/remove/:productId', auth, removeItem);

CartRouter.get('/', getAllCarts);
CartRouter.get('/:id', getCartById);
CartRouter.post('/', createCart);
CartRouter.put('/:id', auth, updateCart);
CartRouter.delete('/:id', auth, deleteCart);

module.exports = CartRouter;