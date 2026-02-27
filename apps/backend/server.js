const express = require("express");
const { setupMiddleware } = require("./src/middleware");
const apiRoutes = require("./src/routes");
const config = require("./src/config");
const iaRoutes = require("./src/routes/AIReport");
require("dotenv").config();

const app = express();

setupMiddleware(app);

app.use("/api", apiRoutes);
app.use("/", iaRoutes);

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
