import { ENV } from "./env.js";

let resendClient = null;

try {
  const { Resend } = await import("resend");
  resendClient = ENV.RESEND_API_KEY ? new Resend(ENV.RESEND_API_KEY) : null;
} catch (error) {
  console.warn("Resend unavailable, using fallback email transport:", error.message);
}

export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};

export { resendClient };