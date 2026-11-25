"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_service_js_1 = require("../config/config.service.js");
const connectionDB = async () => {
    await mongoose_1.default.connect(config_service_js_1.DB_URI).then(() => {
        console.log("DB conncted successfully");
    }).catch((err) => {
        console.log("failed to connet DB");
    });
};
exports.default = connectionDB;
