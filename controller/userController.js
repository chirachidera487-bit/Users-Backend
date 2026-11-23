import User from "../Model/userModel.js";

import {
   updateUserProfile,
   deleteUserProfile,
   getUserProfile,
   getAllUserProfile
 } from "../services/userServices.js";

export const createUser = async (req, res) => {
 try {
   const userData = req.body;
   const user = await registerUser(userData);
   res.status(201).json({message: "User created successfully", "user": user});
 } catch (error) {
res.status(400).json({message: error.message});
 } 
} 

export const authenticateUser = async (req, res) => {

try {
   const { email, password } = req.body;
   const user = await loginUser(email, password);
   res.json(user);

   if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
   }

   if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
   }
 } catch (error) {
   res.status(401).json({message: error.message});
}

}


 
export const fetchProfile = async(req, res) => {
try {
   const user = await getUserProfile();
   res.json(user);
} catch (error) {
   res.status(404).json({ message: error.message });

  }
} 
 
export const fetchAllProfile = async(req, res) => {
try {
   const users = await getAllUserProfile();
   res.status(200).json({  result:users.length, users })
} catch (error) {
   res.status(404).json({ message: error.message });
  }
} 










export const updateUser = async (req, res) => {
   try {
      const user = await User.findByIdAndUpdate(req.param.userName, req.body, { new: true });
      
      res.json(user);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

export const deleteUser = async (req, res) => {
   try {
      const user = await User.findByIdAndDelete(req.param.userName);
      
      res.json(user);
   } catch (error) {
      res.status(404).json({ message: error.message })
   }
}

// export default 