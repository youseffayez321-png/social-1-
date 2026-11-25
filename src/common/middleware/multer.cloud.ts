import multer from "multer";
import { Store_type, Multer_enum } from "../enum/multer.enum.js";

import { tmpdir } from "node:os";
import { Request } from "express";
import { randomUUID } from "node:crypto";
import { AppError } from "../utils/globalError.js";
export const multer_cloud = ({
    customTypes,
    store_type,
}: {
    customTypes: any;
    store_type: Store_type;
}) => {
    const storage =
        store_type === Store_type.memory
            ? multer.memoryStorage()
            : multer.diskStorage({
                    destination: tmpdir,
                    filename: (req, file, cb) => {
                        cb(null, randomUUID() + "__" + file.originalname);
                    },
                });
    function fileFilter(
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback,
    ) {
        if (customTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid file type", 400));
        }
    }
    const upload = multer({
        storage,
        fileFilter,
    });
    return upload;
};
