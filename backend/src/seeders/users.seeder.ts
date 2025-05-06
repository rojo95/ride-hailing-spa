import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import logger from "../utils/logger";
import { connectDB } from "../config/database.config";

dotenv.config();

const seedUsers = async () => {
    const shouldReset =
        process.argv.includes("--reset") || process.argv.includes("--r");

    try {
        await connectDB();

        if (shouldReset) {
            // Elimina todos los usuarios existentes
            logger.info("Resetting the Users collection data");
            await User.deleteMany({});
        }

        // Usuarios de ejemplo
        const users = [
            {
                email: "admin@admin.com",
                password: await bcrypt.hash("Aadmin123", 10),
                role: "admin",
                secretQuestion: "Nombre de tu primera mascota",
                secretAnswer: await bcrypt.hash("Firulais", 10),
            },
            {
                email: "user@user.com",
                password: await bcrypt.hash("User123", 10),
                role: "user",
                secretQuestion: "Ciudad de nacimiento",
                secretAnswer: await bcrypt.hash("Madrid", 10),
            },
        ];

        // Inserta los nuevos usuarios
        await User.insertMany(users);
        logger.debug("Users inserted correctly");
        process.exit(0);
    } catch (error) {
        logger.debug(`Error inserting users`);
        logger.error(error);
        process.exit(1);
    }
};

seedUsers();
