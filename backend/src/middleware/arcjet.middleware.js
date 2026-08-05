import aj from "../lib/arcjet.js";

export const arcjetProtection = async (req, res, next) => {
  try {
    if (!aj) {
      return next();
    }

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
      }
      if (decision.reason?.isBot?.()) {
        return res.status(403).json({ message: "Bot access denied." });
      }
      return res.status(403).json({ message: "Access denied by security policy." });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};