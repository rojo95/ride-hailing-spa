import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/database.config";
import logger from "./utils/logger";

dotenv.config();

const PORT = process.env.APP_PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err: unknown) => {
        logger.error(err);
    });
