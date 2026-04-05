import path from "path";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import AppError from "../utils/AppError";
import { HttpStatus } from "../utils/httpStatus";

const storage = multer.memoryStorage();

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                "Only .jpeg, .jpg, .png formats are allowed",
                HttpStatus.BAD_REQUEST
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;
