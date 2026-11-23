
  import { signToken, verifyToken } from "../Middleware/jwt.js";

   import User from "../Model/userModel.js";
   
   import bcrypt from "bcrypt";
   
   export const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  email = email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({
    id: user._id,
    userName: user.userName,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const registerUser = async (userData) => {
  let { userName, email, password, fullName, address, gender, profileImage, age, phone } = userData;

  email = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    userName,
    email,
    password: hashedPassword,
    fullName,
    address,
    gender,
    profileImage,
    age,
    phone,
  });

  return await user.save();
}; 

  export const createPasswordResetToken = async (email) => {
    if (!email || typeof email !== "string") {
      const error = Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return null;
    }

    return {
      userName: user.userName,
      email: user.email,
      resetToken: signToken({
        id: user._id.toString(),
        purpose: "password-reset",
      }),
    };
  }; 






export const confirmToken = (token) => {
    if (!token || typeof token !== "string") {
        const error = Error("Token is required");
        error.statusCode = 400;
        throw error;
    }

    try {
        verifyToken(token);
        return { valid: true };
    } catch (cause) {
        if (
            cause.name === "TokenExpiredError" ||
            cause.name === "JsonWebTokenError" ||
            cause.name === "NotBeforeError"
        ) {
            const error = Error("Invalid or expired token");
            error.statusCode = 401;
            throw error;
        }
        throw cause;
    }
};

export const resetUserPassword = async (token, password) => {
    if (!token || !password) {
        const error = Error("Token and new password are required");
        error.statusCode = 400;
        throw error;
    }
    const decoded = verifyToken(token);
    if (decoded.purpose !== "password-reset" || !decoded.id) {
      const error = Error("Invalid password reset token");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { password: await bcrypt.hash(password, 10) }
    );
    if(!user){
        const error = Error("user not found");
        error.statusCode = 400;
        throw error;
    }

    return { message: "Password reset successfully" };

}