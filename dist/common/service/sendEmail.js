"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_otp = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_crypto_1 = require("node:crypto");
const config_service_js_1 = require("../../config/config.service.js");
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_service_js_1.EMAIL,
            pass: config_service_js_1.PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: `"EL JO" <${config_service_js_1.EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html || "",
        attachments: options.attachments || [],
    });
    console.log(info.messageId);
    return info.accepted.length > 0 ? true : false;
};
exports.sendEmail = sendEmail;
const generate_otp = () => {
    return (0, node_crypto_1.randomInt)(100000, 1000000).toString();
};
exports.generate_otp = generate_otp;
