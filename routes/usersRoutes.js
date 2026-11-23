import express from "express";
import {createUser, fetchProfile, authenticateUser, updateUser, deleteUser} from "../controller/userController.js";
// import { authenticateUser } from "./Model/controller/userController.js";
const  router = express.Router();


 router.get("/", fetchProfile);
router.post("/", createUser);
 router.post("/login", authenticateUser)
router.patch("/:userName", updateUser);
router.delete("/:userName", deleteUser);

export default router;