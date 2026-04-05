import path from "path";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { BadRequestException } from "../utils/AppError";
import { HttpStatus } from "../utils/httpStatus";

const storage = multer.memoryStorage();

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const extname = allowedTypes.includes(file.mimetype);
    const mimetype = allowedTypes.includes(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(
            new BadRequestException(
                "Error: Only .jpeg, .jpg, .png formats are allowed"
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
