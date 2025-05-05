import mongoose from "mongoose";
import logger from "../utils/logger";

const MONGO_URI: string = process.env.MONGO_URI || "";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info("Database connected.");
    } catch (error: unknown) {
        logger.error(error);
        process.exit(1);
    }
};
