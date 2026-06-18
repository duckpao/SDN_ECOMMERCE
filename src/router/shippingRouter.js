const express = require('express');
const {
  getAllShippings,
  getShippingById,
  createShipping,
  updateShipping,
  deleteShipping,
} = require('../controller/shippingController');

const ShippingRouter = express.Router();

ShippingRouter.get('/', getAllShippings);
ShippingRouter.get('/:id', getShippingById);
ShippingRouter.post('/', createShipping);
ShippingRouter.put('/:id', updateShipping);
ShippingRouter.delete('/:id', deleteShipping);

module.exports = ShippingRouter;
