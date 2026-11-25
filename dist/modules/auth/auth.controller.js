"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_js_1 = __importDefault(require("./auth.service.js"));
const validation_js_1 = __importDefault(require("../../common/middleware/validation.js"));
const auth_validation_js_1 = require("./auth.validation.js");
// import { authentication } from "../../common/middleware/authentication.js";
const authRouter = (0, express_1.Router)();
authRouter.post("/signUp", (0, validation_js_1.default)(auth_validation_js_1.signUpSchema), auth_service_js_1.default.signUp);
authRouter.post("/confirmEmail", (0, validation_js_1.default)(auth_validation_js_1.confirmEmailSchema), auth_service_js_1.default.confirmEmail);
authRouter.post("/signIn", (0, validation_js_1.default)(auth_validation_js_1.signInSchema), auth_service_js_1.default.signIn);
authRouter.post("/resetPassword", (0, validation_js_1.default)(auth_validation_js_1.resetPasswordSchema), auth_service_js_1.default.resetPassword);
// authRouter.post("/refreshToken",validation(refreshTokenSchema),AS.refreshToken)
exports.default = authRouter;
