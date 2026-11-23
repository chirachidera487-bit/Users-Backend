import mongoose from "mongoose";
import User from "../Model/userModel.js";

const userRoles = ["user", "admin", "superAdmin"];

export const updateUserRoleController = async (req, res) => {
  const { id } = req.params;
  const role = req.body?.role;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!userRoles.includes(role)) {
    return res.status(400).json({ message: "A valid role is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserController = updateUserRoleController;

export const removeUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};