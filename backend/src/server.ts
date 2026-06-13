import "dotenv/config";

import { app } from "./app";
import { prisma } from "./database";
import { logger } from "./utils/logger";

const PORT = Number(process.env.PORT) || 3333;

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info("database_connected");

    const server = app.listen(PORT, () => {
      logger.info("server_started", {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
      });
    });

    server.on("error", (error) => {
      logger.error("unexpected_error", {
        context: "server_listener",
        message: error.message,
      });
    });
  } catch (error) {
    logger.error("database_error", {
      message:
        error instanceof Error ? error.message : "Unknown database error",
    });
    process.exit(1);
  }
}

void bootstrap();
