import { connectDatabase } from './database/connection';
import config from './config/env';
import app from './app';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB Atlas first
  await connectDatabase();

  // Start listening only after DB is ready
  app.listen(config.PORT, () => {
    console.log(`[Visionix] 🚀 Server running on port ${config.PORT} (${config.NODE_ENV})`);
    console.log(`[Visionix] 📡 API:    http://localhost:${config.PORT}/api`);
    console.log(`[Visionix] 🏥 Health: http://localhost:${config.PORT}/api/health`);
  });
};

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Visionix] ❌ Failed to start server: ${message}`);
  process.exit(1);
});
