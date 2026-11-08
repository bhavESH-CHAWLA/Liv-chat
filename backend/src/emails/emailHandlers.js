import { ENV } from "../lib/env.js";
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

const parseSender = (from) => {
  const match = from?.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  return match
    ? { name: match[1].replace(/^["']|["']$/g, ""), email: match[2].trim() }
    : { email: from?.trim() };
};

export const createEmailSender = ({
  apiKey,
  from,
  fetchImpl = fetch,
}) =>
  async (email, subject, html) => {
    const sender = parseSender(from);
    if (!apiKey || !sender.email) {
      throw new EmailDeliveryError("Email delivery is not fully configured");
    }

    try {
      const response = await fetchImpl("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender,
          to: [{ email }],
          subject,
          htmlContent: html,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        throw Object.assign(new Error(`Brevo API returned HTTP ${response.status}`), {
          status: response.status,
        });
      }

      const result = await response.json();
      console.log(`${subject} sent successfully`, result.messageId);
      return {
        provider: "brevo-api",
        status: "sent",
        message: `${subject} sent successfully.`,
      };
    } catch (error) {
      console.error("Brevo API email delivery failed:", {
        subject,
        code: error.code,
        responseCode: error.status,
        message: error.message,
      });
      throw new EmailDeliveryError("Email delivery failed", { cause: error });
    }
  };

const sendEmail = createEmailSender({
  apiKey: ENV.BREVO_API_KEY,
  from: ENV.EMAIL_FROM,
});

export const sendWelcomeEmail = async (email, name, clientURL) =>
  sendEmail(email, "Welcome to LIV-CHAT!", createWelcomeEmailTemplate(name, clientURL));

export const sendEmailVerification = async (email, name, clientURL, token) =>
  sendEmail(email, "Verify Your LIV-CHAT Email", createEmailVerificationTemplate(name, clientURL, token));

export const sendPasswordResetEmail = async (email, name, clientURL, token) =>
  sendEmail(email, "Reset Your LIV-CHAT Password", createPasswordResetEmailTemplate(name, clientURL, token));

export const sendTwoFactorCodeEmail = async (email, name, code) =>
  sendEmail(email, "Your LIV-CHAT two-factor code", createTwoFactorTemplate(name, code));