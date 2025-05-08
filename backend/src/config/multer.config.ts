import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        // Extraer la extensión original
        const ext = path.extname(file.originalname);
        // Tomar el nombre deseado o el nombre original sin extensión
        const rawName = req.body.name || path.basename(file.originalname, ext);
        // Reemplazar caracteres peligrosos
        const safeName = rawName.replace(/[^a-z0-9_-]/gi, "_");

        cb(null, `${safeName}${ext}`);
    },
});

// Filtro para aceptar solo ciertos tipos de archivos
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar archivo
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
};

// Configuración de multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar a 5 MB
    fileFilter: fileFilter,
});

export default upload;
