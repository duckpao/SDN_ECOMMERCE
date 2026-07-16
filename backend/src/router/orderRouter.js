const express = require("express");
const {
  getAllOrders, getOrderById, createOrder,
  confirmOrder, updateOrderStatus, deleteOrder, getMyOrders,
} = require("../controller/orderController");
const { auth, authorize } = require("../middleware/auth");

const OrderRouter = express.Router();

OrderRouter.get("/", auth, authorize("admin"), getAllOrders);
OrderRouter.get("/my-orders", auth, getMyOrders);
OrderRouter.get("/:id", auth, getOrderById);
OrderRouter.post("/", auth, createOrder);
OrderRouter.patch("/:id/confirm", auth, authorize("admin"), confirmOrder);
OrderRouter.patch("/:id/status", auth, authorize("admin"), updateOrderStatus);
OrderRouter.delete("/:id", auth, authorize("admin"), deleteOrder);

module.exports = OrderRouter;
