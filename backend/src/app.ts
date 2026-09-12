import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./config/prisma";
import { swaggerSpec } from "./config/swagger";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organizations/organization.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import organizationMemberRoutes from "./modules/organization-members/organization-member.routes";
import commentRoutes from "./modules/comments/comment.routes";
import { authRateLimiter } from "./middleware/rate-limit.middleware";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigins = env.CLIENT_URL
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FlowForge API is running",
  });
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      api: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      success: false,
      api: "healthy",
      database: "disconnected",
    });
  }
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRateLimiter, authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/organization-members", organizationMemberRoutes);
app.use("/comments", commentRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
