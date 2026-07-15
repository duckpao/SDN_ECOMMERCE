const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/productController');

const ProductRouter = express.Router();

ProductRouter.get('/', getAllProducts);
ProductRouter.get('/:id', getProductById);
ProductRouter.post('/', createProduct);
ProductRouter.put('/:id', updateProduct);
ProductRouter.delete('/:id', deleteProduct);

module.exports = ProductRouter;
