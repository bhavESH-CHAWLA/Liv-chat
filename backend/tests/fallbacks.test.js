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

test("email sender reports missing email configuration instead of claiming the message was queued", async () => {
  const sendEmail = createEmailSender({ apiKey: "", from: "" });

  await assert.rejects(
    sendEmail("user@example.com", "Test", "<p>Test</p>"),
    EmailDeliveryError
  );
});

test("email sender sends through Brevo's HTTPS API when configured", async () => {
  let request;
  const sendEmail = createEmailSender({
    apiKey: "test-api-key",
    from: "Liv Chat <no-reply@example.com>",
    async fetchImpl(url, options) {
      request = { url, options };
      return {
        ok: true,
        async json() {
          return { messageId: "test-message-id" };
        },
      };
    },
  });

  const result = await sendEmail("user@example.com", "Test", "<p>Test</p>");
  const payload = JSON.parse(request.options.body);

  assert.equal(result.status, "sent");
  assert.equal(result.provider, "brevo-api");
  assert.equal(request.url, "https://api.brevo.com/v3/smtp/email");
  assert.equal(request.options.headers["api-key"], "test-api-key");
  assert.deepEqual(payload.sender, { name: "Liv Chat", email: "no-reply@example.com" });
  assert.deepEqual(payload.to, [{ email: "user@example.com" }]);
  assert.equal(payload.subject, "Test");
  assert.equal(payload.htmlContent, "<p>Test</p>");
});

test("email sender reports Brevo API rejections", async () => {
  const sendEmail = createEmailSender({
    apiKey: "test-api-key",
    from: "no-reply@example.com",
    async fetchImpl() {
      return { ok: false, status: 401 };
    },
  });

  await assert.rejects(
    sendEmail("user@example.com", "Test", "<p>Test</p>"),
    (error) => error instanceof EmailDeliveryError && error.cause.status === 401
  );
});
