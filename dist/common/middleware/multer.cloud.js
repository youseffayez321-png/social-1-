"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer_cloud = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_enum_js_1 = require("../enum/multer.enum.js");
const node_os_1 = require("node:os");
const node_crypto_1 = require("node:crypto");
const globalError_js_1 = require("../utils/globalError.js");
const multer_cloud = ({ customTypes, store_type, }) => {
    const storage = store_type === multer_enum_js_1.Store_type.memory
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
            destination: node_os_1.tmpdir,
            filename: (req, file, cb) => {
                cb(null, (0, node_crypto_1.randomUUID)() + "__" + file.originalname);
            },
        });
    function fileFilter(req, file, cb) {
        if (customTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new globalError_js_1.AppError("Invalid file type", 400));
        }
    }
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
    });
    return upload;
};
exports.multer_cloud = multer_cloud;
