import { Request, Response } from "express";
import logger from "../utils/logger";

export default class FileController {
    static async upload(req: Request, res: Response) {
        try {
            const { nombre, descripcion } = req.body;
            let file: Express.Multer.File | undefined;

            if (
                req.files &&
                typeof req.files === "object" &&
                "file" in req.files
            ) {
                const fileArray = req.files["file"] as Express.Multer.File[];
                if (Array.isArray(fileArray) && fileArray.length > 0) {
                    file = fileArray[0];
                }
            }

            if (!file) {
                res.status(400).json({ error: "No se subió ningún archivo" });
                return;
            }

            if (!file) {
                res.status(400).json({ error: "No se subió ningún archivo" });
                return;
            }

            const imageUrl = `/uploads/${file.filename}`;

            res.status(200).json({
                mensaje: "Archivo subido con éxito",
                url: imageUrl,
            });
        } catch (error) {
            logger.debug(`Error uploading file: ${req.originalUrl}`);
            logger.error(error);
            res.status(500).json({ error: "Error al subir archivo" });
        }
    }
}
