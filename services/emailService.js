import "dotenv/config";
import nodemailer from "nodemailer";
import { MailDev } from "maildev";

const isProduction = process.env.NODE_ENV === "production";
const smtpHost = process.env.SMTP_HOST || (isProduction ? "" : "127.0.0.1");
const smtpPort = Number(process.env.SMTP_PORT || 1025);
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const apiBaseUrl = new URL(process.env.API_BASE_URL || "http://localhost:3000");

if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
  throw new Error("SMTP_PORT must be a valid port number");
}

if (Boolean(smtpUser) !== Boolean(smtpPass)) {
  throw new Error("Set both SMTP_USER and SMTP_PASS, or leave both unset");
}

if (!isProduction && !process.env.SMTP_HOST) {
  const maildev = new MailDev({
    smtp: smtpPort,
    web: Number(process.env.MAILDEV_WEB_PORT || 1080),
    ip: "127.0.0.1",
    webIp: "127.0.0.1",
  });


  await maildev.start();
  console.log(`Local email server listening on ${smtpHost}:${smtpPort}`);
  console.log(`View captured emails at http://127.0.0.1:${process.env.MAILDEV_WEB_PORT || 1080}`);
}

const transporter = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      ...(smtpUser ? { auth: { user: smtpUser, pass: smtpPass } } : {}),
    })
  : null;

if (transporter) {
  transporter.verify()
    .then(() => console.log("SMTP connection successful"))
    .catch((error) => console.error("SMTP connection failed:", error));
} else {
  console.error("Email delivery disabled: SMTP_HOST must be configured");
}

export const buildWelcomeEmail = ({ userName, email }) => ({
  from: "USER APP <no-reply@userapp.local>",
  to: email,
  subject: "Welcome to USERS APP",
  html: ` 
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>Welcome, ${userName}</h2>
      <p>Thanks for joining Users App.</p>
      <p>Your account has been successfully created.</p>
      <p>You can now <a href="http://127.0.0.1:5500/index.html">log in</a>.</p>
    </div>
  `,
});


export const buildPasswordResetEmail = ({ userName, email, resetToken }) => {
  const resetUrl = new URL("/auth/reset-password", apiBaseUrl);
  resetUrl.searchParams.set("token", resetToken);

  return {
    from: "PETS APP <no-reply@petapp.local>",
    to: email,
    subject: "Password Reset Request",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2>Password Reset Request</h2>
      <p>Hi ${userName},</p>
      <p>You have requested to reset your password. Please click the link below to reset it:</p>
      <p><a href="${resetUrl}" target="_blank">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    </div>

  `,
  };
};

export const sendPasswordResetEmail = async ({ userName, email, resetToken }) => {
  const mail = buildPasswordResetEmail({ userName, email, resetToken });

  if (!transporter) {
    console.error("Password reset email not sent: SMTP_HOST must be configured");
    return false;
  }

  try {
    await transporter.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    });
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    return false;
  }
};


export const sendWelcomeEmail = async (user) => {
  const mail = buildWelcomeEmail({
    userName: user.userName || user.fullName || "there",
    email: user.email,
  });

  if (!transporter) {
    console.error("Welcome email not sent: SMTP_HOST must be configured");
    return false;
  }

  try {
    await transporter.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    });

    return true;
  } catch (error) {
    console.log("Failed to send Welcome email:", error.message);
    return false;
  }
}; 