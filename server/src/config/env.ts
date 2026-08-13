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
  GEMINI_API_KEY?: string;
  YOUTUBE_API_KEY?: string;
  CAREER_DATA_MODE: 'mock' | 'production';
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

const nodeEnv = process.env['NODE_ENV'] ?? 'development';
let rawCareerMode = process.env['CAREER_DATA_MODE'] || 'production';

// Strict fallback validations:
if (rawCareerMode !== 'mock' && rawCareerMode !== 'production') {
  rawCareerMode = 'production';
}
if (nodeEnv === 'production') {
  rawCareerMode = 'production'; // Safety lock: Never allow mock mode in production environment
}

const config: ServerConfig = {
  PORT: parseInt(process.env['PORT'] ?? '5000', 10),
  NODE_ENV: nodeEnv,
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRY: process.env['JWT_EXPIRY'] ?? '7d',
  CLIENT_URL: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
  GEMINI_API_KEY: process.env['GEMINI_API_KEY'] || '',
  YOUTUBE_API_KEY: process.env['YOUTUBE_API_KEY'] || '',
  CAREER_DATA_MODE: rawCareerMode as 'mock' | 'production',
};

console.log(`[Visionix] GEMINI_API_KEY loaded: ${!!config.GEMINI_API_KEY && config.GEMINI_API_KEY.trim().length > 0}`);
console.log(`[Visionix] YOUTUBE_API_KEY loaded: ${!!config.YOUTUBE_API_KEY && config.YOUTUBE_API_KEY.trim().length > 0}`);

export default config;
