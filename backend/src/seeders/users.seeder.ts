import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import logger from "../utils/logger";

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");

        // Elimina todos los usuarios existentes
        await User.deleteMany({});

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
