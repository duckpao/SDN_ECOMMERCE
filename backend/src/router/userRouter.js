const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  register,
  login,
  getProfile,
  updateProfile,
  getCustomers,
  getEmployees,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controller/userController");
const { auth, authorize } = require("../middleware/auth");

const UserRouter = express.Router();

// Public auth routes
UserRouter.post("/register", register);
UserRouter.post("/login", login);

// Protected profile routes
UserRouter.get("/profile", auth, getProfile);
UserRouter.put("/profile", auth, updateProfile);
UserRouter.post("/addresses", auth, addAddress);
UserRouter.put("/addresses/:addressId", auth, updateAddress);
UserRouter.delete("/addresses/:addressId", auth, deleteAddress);
UserRouter.patch("/addresses/:addressId/default", auth, setDefaultAddress);

// Admin-only user management
UserRouter.get("/customers", auth, authorize("admin"), getCustomers);
UserRouter.get("/employees", auth, authorize("admin"), getEmployees);
UserRouter.get("/", auth, authorize("admin"), getAllUsers);
UserRouter.get("/:id", auth, getUserById);
UserRouter.post("/", auth, authorize("admin"), createUser);
UserRouter.put("/:id", auth, updateUser);
UserRouter.delete("/:id", auth, authorize("admin"), deleteUser);
module.exports = UserRouter;
