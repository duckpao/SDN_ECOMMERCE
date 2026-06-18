const express = require('express');

const UserRouter = require('./userRouter');
const CategoryRouter = require('./categoryRouter');
const BrandRouter = require('./brandRouter');
const ProductRouter = require('./productRouter');
const CartRouter = require('./cartRouter');
const OrderRouter = require('./orderRouter');
const PaymentRouter = require('./paymentRouter');
const ShippingRouter = require('./shippingRouter');

const router = express.Router();

router.use('/users', UserRouter);
router.use('/categories', CategoryRouter);
router.use('/brands', BrandRouter);
router.use('/products', ProductRouter);
router.use('/carts', CartRouter);
router.use('/orders', OrderRouter);
router.use('/payments', PaymentRouter);
router.use('/shippings', ShippingRouter);

module.exports = router;
