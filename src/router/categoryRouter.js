const express = require('express');
const {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controller/categoryController');

const CategoryRouter = express.Router();

CategoryRouter.get('/', getAllCategorys);
CategoryRouter.get('/:id', getCategoryById);
CategoryRouter.post('/', createCategory);
CategoryRouter.put('/:id', updateCategory);
CategoryRouter.delete('/:id', deleteCategory);

module.exports = CategoryRouter;
