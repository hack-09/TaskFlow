const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: "Too many AI requests. Try again later.",
});

module.exports = rateLimiter;
