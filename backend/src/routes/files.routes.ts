import { Router } from "express";
import FileController from "../controllers/file.controller";
import upload from "../config/multer.config";

const fileRoutes = Router();

fileRoutes.post(
    "/upload",
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "name", maxCount: 1 },
    ]),
    FileController.upload
);

export default fileRoutes;
