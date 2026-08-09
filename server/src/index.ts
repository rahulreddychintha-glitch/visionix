import { connectDatabase } from './database/connection';
import config from './config/env';
import app from './app';

const startServer = (): void => {
  // Start listening immediately so server port is active without delay
  app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`[Visionix] 🚀 Server running on port ${config.PORT} (${config.NODE_ENV})`);
    console.log(`[Visionix] 📡 API:    http://localhost:${config.PORT}/api`);
    console.log(`[Visionix] 🏥 Health: http://localhost:${config.PORT}/api/health`);
  });

  // Connect to MongoDB Atlas
  connectDatabase().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Visionix] ❌ Database connection error: ${message}`);
  });
};

startServer();
