import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * 300 requests per 15-minute window per IP.
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      errors: [],
    });
  },
});

/**
 * Strict Authentication Rate Limiter
 * 20 requests per 15-minute window per IP to prevent brute-force attacks on login/signup.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
      errors: [],
    });
  },
});

/**
 * AI Endpoints Rate Limiter
 * 30 requests per minute to prevent expensive AI API credit abuse.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 AI requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'AI request limit reached. Please slow down and try again shortly.',
      errors: [],
    });
  },
});
