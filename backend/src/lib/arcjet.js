import { ENV } from "./env.js";

let aj = null;

if (ENV.ARCJET_KEY) {
  try {
    const arcjet = (await import("@arcjet/node")).default;
    const { shield, detectBot, slidingWindow } = await import("@arcjet/node");
    const mode = ENV.NODE_ENV === "production" ? "ENFORCE" : "DRY_RUN";

    aj = arcjet({
      key: ENV.ARCJET_KEY,
      rules: [
        shield({ mode }),
        detectBot({
          mode,
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        slidingWindow({
          mode,
          max: 100,
          interval: 60,
        }),
      ],
    });
  } catch (error) {
    console.warn("Arcjet unavailable, continuing without it:", error.message);
  }
}

export default aj;