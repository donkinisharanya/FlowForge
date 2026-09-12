import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlowForge API",
      version: "1.0.0",
      description: "Task management and collaboration backend API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [],
});
