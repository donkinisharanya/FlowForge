import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import {
  connectRedis,
  disconnectRedis,
} from "./config/redis";

async function startServer() {
  try {
    await prisma.$connect();
    await connectRedis();

    const server = app.listen(env.PORT, () => {
      console.log(
        `🚀 FlowForge API running on http://localhost:${env.PORT}`,
      );
    });

    const shutdown = async () => {
      server.close(async () => {
        await disconnectRedis();
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start FlowForge:", error);

    await disconnectRedis().catch(() => undefined);
    await prisma.$disconnect().catch(() => undefined);

    process.exit(1);
  }
}

void startServer();
