import { transporter } from "../lib/resend.js";
import {
  createWelcomeEmailTemplate,
  createEmailVerificationTemplate,
  createPasswordResetEmailTemplate,
  createTwoFactorTemplate,
} from "../emails/emailTemplates.js";

export class EmailDeliveryError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "EmailDeliveryError";
  }
}

export const createEmailSender = ({ mailTransport, from }) =>
  async (email, subject, html) => {
    if (!mailTransport || !from) {
      throw new EmailDeliveryError("SMTP is not fully configured");
    }

    try {
      const info = await mailTransport.sendMail({
        from,
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
      console.error("SMTP email delivery failed:", {
        subject,
        code: error.code,
        responseCode: error.responseCode,
        message: error.message,
      });
      throw new EmailDeliveryError("SMTP email delivery failed", { cause: error });
    }
  };

const sendEmail = createEmailSender({
  mailTransport: transporter,
  from: process.env.EMAIL_FROM,
});

export const sendWelcomeEmail = async (email, name, clientURL) =>
  sendEmail(email, "Welcome to LIV-CHAT!", createWelcomeEmailTemplate(name, clientURL));

export const sendEmailVerification = async (email, name, clientURL, token) =>
  sendEmail(email, "Verify Your LIV-CHAT Email", createEmailVerificationTemplate(name, clientURL, token));

export const sendPasswordResetEmail = async (email, name, clientURL, token) =>
  sendEmail(email, "Reset Your LIV-CHAT Password", createPasswordResetEmailTemplate(name, clientURL, token));

export const sendTwoFactorCodeEmail = async (email, name, code) =>
  sendEmail(email, "Your LIV-CHAT two-factor code", createTwoFactorTemplate(name, code));