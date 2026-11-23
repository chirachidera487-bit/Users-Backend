import {
  authenticateUser,
  createUser,
  forgotPassword,
  confirmToken,
  resetPassword,
  showResetPasswordForm,
} from "../controller/authController.js";

import express from "express";
const authRoutes = express.Router();

authRoutes.post("/login", authenticateUser);
// authRoutes.post("/logout", createUser);

authRoutes.post("/register", createUser);

authRoutes.post("/forgotpassword", forgotPassword);
authRoutes.post("/confirm-token", confirmToken);
authRoutes.get("/reset-password", showResetPasswordForm);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes; 