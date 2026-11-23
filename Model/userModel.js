import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 userName: {
type: String, required: true, unique: true
 },
 fullName: {
type: String, required: true, unique: true
 }, 
email: {
type: String, required: true, unique: true
},
password: {
type: String, required: true
},
phone: {
type: String, required: true
},
gender: {
    type: String, enum: ["male", "female", "other"]
},
address: {
type: String
},
profileImage: {
    type: String
},
age: {
type: Number
},
role: {
  type: String,
  enum: ["user", "admin", "superAdmin"],
  default: "user"
},

});

const User = mongoose.model("User", userSchema);

export default User;