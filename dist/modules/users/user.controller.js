"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_js_1 = __importDefault(require("./user.service.js"));
const authentication_js_1 = require("../../common/middleware/authentication.js");
const user_validation_js_1 = require("./user.validation.js");
const validation_js_1 = __importDefault(require("../../common/middleware/validation.js"));
const userRouter = (0, express_1.Router)();
userRouter.get("/profile", authentication_js_1.authentication, user_service_js_1.default.getProfile);
userRouter.patch("/update-profile", (0, validation_js_1.default)(user_validation_js_1.updateProfileSchema), authentication_js_1.authentication, user_service_js_1.default.updateProfile);
userRouter.patch("/follow-user", authentication_js_1.authentication, user_service_js_1.default.followUser);
userRouter.patch("/unfollow-user", authentication_js_1.authentication, user_service_js_1.default.unfollowUser);
userRouter.patch("/search-user", authentication_js_1.authentication, user_service_js_1.default.searchUser);
exports.default = userRouter;
