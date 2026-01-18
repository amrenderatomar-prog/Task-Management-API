import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
        description: "API documentation for the Task Management system",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
},
  apis: ["./src/v1/components/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);