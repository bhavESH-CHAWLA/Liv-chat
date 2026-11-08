import test from "node:test";
import assert from "node:assert/strict";

import { arcjetProtection } from "../src/middleware/arcjet.middleware.js";
import { createEmailSender, EmailDeliveryError } from "../src/emails/emailHandlers.js";

test("arcjet middleware falls back to next when no Arcjet configuration is available", async () => {
  const req = {
    method: "GET",
    ip: "127.0.0.1",
    headers: {},
  };

  let nextCalled = false;
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
    },
  };

  await arcjetProtection(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test("email sender reports missing SMTP configuration instead of claiming the message was queued", async () => {
  const sendEmail = createEmailSender({ mailTransport: null, from: "" });

  await assert.rejects(
    sendEmail("user@example.com", "Test", "<p>Test</p>"),
    EmailDeliveryError
  );
});

test("email sender reports successful SMTP delivery", async () => {
  let sentMessage;
  const sendEmail = createEmailSender({
    mailTransport: {
      async sendMail(message) {
        sentMessage = message;
        return { messageId: "test-message-id" };
      },
    },
    from: "Liv Chat <no-reply@example.com>",
  });

  const result = await sendEmail("user@example.com", "Test", "<p>Test</p>");

  assert.equal(result.status, "sent");
  assert.equal(sentMessage.to, "user@example.com");
  assert.equal(sentMessage.from, "Liv Chat <no-reply@example.com>");
});

test("email sender surfaces SMTP delivery failures", async () => {
  const sendEmail = createEmailSender({
    mailTransport: {
      async sendMail() {
        throw Object.assign(new Error("SMTP unavailable"), { code: "ECONNECTION" });
      },
    },
    from: "no-reply@example.com",
  });

  await assert.rejects(
    sendEmail("user@example.com", "Test", "<p>Test</p>"),
    (error) => error instanceof EmailDeliveryError && error.cause.code === "ECONNECTION"
  );
});
