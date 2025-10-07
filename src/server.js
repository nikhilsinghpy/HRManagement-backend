import "dotenv-flow/config";
import app from "./app.js";
import { connectDB } from "./database/mongo.connection.js";
import logger from "./utils/logger.utils.js";
const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";
// Connect to MongoDB
connectDB()
  .then(() => {
    logger.info(`CONNECTED TO DB_NAME: ${process.env.DB_NAME}`);
    app.listen(PORT, () =>
      logger.info(`SERVER IS RUNNING IN ${env} MODE ON ${PORT}`)
    );
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
    app.close?.();
    process.exit(1);
  });
