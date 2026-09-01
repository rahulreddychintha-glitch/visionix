import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env';
import routes from './routes/index';
import { errorMiddleware } from './middleware/error';
import { generalRateLimiter } from './middleware/rateLimit';

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const configuredOrigins = (config.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const isLocalOrPrivateNetwork = (origin: string): boolean => {
  try {
    const parsed = new URL(origin);
    const hostname = parsed.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return true;
    }
    if (
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      hostname.endsWith('.local')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      if (
        configuredOrigins.includes(origin) ||
        (config.NODE_ENV !== 'production' && isLocalOrPrivateNetwork(origin))
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing & Size Limits ───────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Global Rate Limiting ─────────────────────────────────────────────────────
app.use('/api', generalRateLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
    errors: [],
  });
});

// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(errorMiddleware);

export default app;

