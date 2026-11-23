import express from 'express';
import mongoose from 'mongoose';
import usersRoutes from './routes/usersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config({ path: "./.env" }); 

const app = express();
const Port = 3000;
  
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));
 
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the User Management API");
});

mongoose.connect("mongodb://localhost:27017/users")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error("Error connecting to mongodb", err);
  });

app.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
});