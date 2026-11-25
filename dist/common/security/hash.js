"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compare = exports.Hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_service_js_1 = require("../../config/config.service.js");
const Hash = async (plainText, salt_rounds = config_service_js_1.SALT_ROUNDS) => {
    return await bcrypt_1.default.hashSync(plainText, salt_rounds);
};
exports.Hash = Hash;
const Compare = async (plainText, cipherText) => {
    return await bcrypt_1.default.compareSync(plainText, cipherText);
};
exports.Compare = Compare;
