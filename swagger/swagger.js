const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API 문서",
      description: "Node.js Swagger documentation using swagger-jsdoc",
    },
    servers: [
      {
        url: "http://localhost:4000", // 요청 URL
      },
    ],
  },
  apis: ["./routers/*.js", "./routers/user/*.js"], // Swagger 파일 경로
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
  