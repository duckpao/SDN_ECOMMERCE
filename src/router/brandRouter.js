const express = require('express');
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controller/brandController');

const BrandRouter = express.Router();

BrandRouter.get('/', getAllBrands);
BrandRouter.get('/:id', getBrandById);
BrandRouter.post('/', createBrand);
BrandRouter.put('/:id', updateBrand);
BrandRouter.delete('/:id', deleteBrand);

module.exports = BrandRouter;
