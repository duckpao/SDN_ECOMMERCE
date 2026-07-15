const express = require('express');
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} = require('../controller/paymentController');

const PaymentRouter = express.Router();

PaymentRouter.get('/', getAllPayments);
PaymentRouter.get('/:id', getPaymentById);
PaymentRouter.post('/', createPayment);
PaymentRouter.put('/:id', updatePayment);
PaymentRouter.delete('/:id', deletePayment);

module.exports = PaymentRouter;
