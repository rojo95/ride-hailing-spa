import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/index";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const APP_NAME = process.env.APP_NAME || "la aplicación";

// Rutas
app.get("/", (req, res) => {
    res.status(200).json({
        message: `Bienvenido al backend de ${APP_NAME}`,
    });
});

app.use("/api", apiRoutes);

export default app;
