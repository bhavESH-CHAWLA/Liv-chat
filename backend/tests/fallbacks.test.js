import test from "node:test";
import assert from "node:assert/strict";

import { arcjetProtection } from "../src/middleware/arcjet.middleware.js";
import { sendWelcomeEmail } from "../src/emails/emailHandlers.js";

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

test("welcome email sending uses a fallback result when no email provider is configured", async () => {
  const result = await sendWelcomeEmail("user@example.com", "Test User", "http://localhost:5173");

  assert.equal(result.provider, "fallback");
  assert.equal(result.status, "queued");
  assert.match(result.message, /queued|provider/i);
});
