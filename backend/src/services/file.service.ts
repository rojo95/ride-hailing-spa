import fs from "fs";
import path from "path";

export default class FileService {
    static async deleteFile(filename: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const filePath = path.join(
                __dirname,
                "..",
                "..",
                "uploads",
                filename
            );

            if (!fs.existsSync(filePath)) {
                return reject(new Error("Archivo no encontrado"));
            }

            fs.unlink(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}
