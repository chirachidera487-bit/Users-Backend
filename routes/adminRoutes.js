import express from "express";
import { authenticate } from "../Middleware/auth.js";
import { authorizeAdmin } from "../Middleware/admin.js";
import { fetchAllProfile } from "../controller/userController.js";
import { removeUser, updateUserRoleController } from "../controller/adminController.js";

const adminRoutes = express.Router();

adminRoutes.use(authenticate, authorizeAdmin);
adminRoutes.get("/users", fetchAllProfile);
adminRoutes.get("/", fetchAllProfile);

adminRoutes.delete("/users/:id", removeUser);
adminRoutes.patch("/users/:id/role", updateUserRoleController);

export default adminRoutes;
 