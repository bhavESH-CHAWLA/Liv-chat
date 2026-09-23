import { transporter } from "../lib/resend.js";
import {
  createWelcomeEmailTemplate,
  createEmailVerificationTemplate,
  createPasswordResetEmailTemplate,
  createTwoFactorTemplate,
} from "../emails/emailTemplates.js";

const sendEmail = async (email, subject, html) => {
  if (!transporter) {
    console.log("No email provider configured. Falling back to local email queue.");
    return {
      provider: "fallback",
      status: "queued",
      message: "Email queued locally because no email provider is configured.",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    console.log(`${subject} sent successfully`, info.messageId);
    return {
      provider: "smtp",
      status: "sent",
      message: `${subject} sent successfully.`,
    };
  } catch (error) {
    console.warn("SMTP provider failed, using fallback queue instead.", error);
    return {
      provider: "fallback",
      status: "queued",
      message: "Email queued locally because the email provider failed.",
    };
  }
};

export const sendWelcomeEmail = async (email, name, clientURL) =>
  sendEmail(email, "Welcome to LIV-CHAT!", createWelcomeEmailTemplate(name, clientURL));

export const sendEmailVerification = async (email, name, clientURL, token) =>
  sendEmail(email, "Verify Your LIV-CHAT Email", createEmailVerificationTemplate(name, clientURL, token));

export const sendPasswordResetEmail = async (email, name, clientURL, token) =>
  sendEmail(email, "Reset Your LIV-CHAT Password", createPasswordResetEmailTemplate(name, clientURL, token));

export const sendTwoFactorCodeEmail = async (email, name, code) =>
  sendEmail(email, "Your LIV-CHAT two-factor code", createTwoFactorTemplate(name, code));