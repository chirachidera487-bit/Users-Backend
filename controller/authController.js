import {
  confirmToken as confirmAuthToken,
  createPasswordResetToken,
  loginUser,
  registerUser,
  resetUserPassword,
} from "../services/authService.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/emailService.js";

export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await loginUser(email, password);

    const user = response.user;
    const token = response.token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // local development
      sameSite: "none",
      partitioned: true
    });

    return res.status(200).json({
      message: "Login Successful",
      token: token,
      user: user
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    console.log("User data received:", userData);

    const user = await registerUser(userData);
    await sendWelcomeEmail(user);

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const resetRequest = await createPasswordResetToken(email);

    if (resetRequest && !(await sendPasswordResetEmail(resetRequest))) {
      const error = new Error("Unable to send password reset email");
      error.statusCode = 502;
      throw error;
    }

    return res.status(200).json({
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Call the resetPassword function from authService
    const response = await resetUserPassword(token, password);

    return res.status(200).json({
      message: response.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const showResetPasswordForm = (req, res) => {
  return res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset your password</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; margin: 0; padding: 2rem; color: #222; }
      main { max-width: 24rem; margin: 4rem auto; }
      label { display: block; margin-top: 1rem; }
      input, button { box-sizing: border-box; font: inherit; margin-top: .35rem; padding: .65rem; width: 100%; }
      button { cursor: pointer; margin-top: 1.25rem; }
      #message { min-height: 1.5em; }
    </style>
  </head>
  <body>
    <main>
      <h1>Reset your password</h1>
      <p>Choose a new password for your account.</p>
      <form id="reset-form">
        <label for="password">New password</label>
        <input id="password" name="password" type="password" autocomplete="new-password" required>
        <label for="confirm-password">Confirm new password</label>
        <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required>
        <button type="submit">Update password</button>
      </form>
      <p id="message" role="status" aria-live="polite"></p>
    </main>
    <script>
      const form = document.getElementById("reset-form");
      const message = document.getElementById("message");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = form.elements.password.value;
        const confirmPassword = form.elements["confirm-password"].value;
        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) {
          message.textContent = "This password reset link is missing its token.";
          return;
        }
        if (password !== confirmPassword) {
          message.textContent = "The passwords do not match.";
          return;
        }

        try {
          const response = await fetch("/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Unable to reset your password.");
          }
          form.hidden = true;
          message.textContent = result.message;
        } catch (error) {
          message.textContent = error.message || "Unable to reset your password.";
        }
      });
    </script>
  </body>
</html>`);
};

export const confirmToken = (req, res) => {
  try {
    const response = confirmAuthToken(req.body?.token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
  
};



export default {
  authenticateUser,
  createUser
};