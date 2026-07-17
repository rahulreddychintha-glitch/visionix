import dotenv from 'dotenv';
import path from 'path';

// Load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ServerConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  CLIENT_URL: string;
}

/**
 * Reads a required environment variable.
 * Exits the process if the variable is not set.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`[Visionix] ❌ FATAL: Missing required environment variable: ${key}`);
    console.error('[Visionix] Server startup aborted. Check your server/.env file.');
    process.exit(1);
  }
  return value;
}

const config: ServerConfig = {
  PORT: parseInt(process.env['PORT'] ?? '5000', 10),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRY: process.env['JWT_EXPIRY'] ?? '7d',
  CLIENT_URL: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
};

export default config;
