const express = require("express");
const { setupMiddleware } = require("./src/middleware");
const apiRoutes = require("./src/routes");
const config = require("./src/config");
const aiRoutes = require("./src/routes/AIReport");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

const swaggerDocument = YAML.load("./docs/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

setupMiddleware(app);

app.use("/api", apiRoutes);
app.use("/", aiRoutes);

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
