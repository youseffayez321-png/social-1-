"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_service_js_1 = require("./config/config.service.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const globalError_js_1 = require("./common/utils/globalError.js");
const auth_controller_js_1 = __importDefault(require("./modules/auth/auth.controller.js"));
const connectionDB_1 = __importDefault(require("./DB/connectionDB"));
const redis_connection_js_1 = __importDefault(require("./DB/redis.connection.js"));
const user_controller_js_1 = __importDefault(require("./modules/users/user.controller.js"));
const app = (0, express_1.default)();
const port = config_service_js_1.PORT;
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 5 * 1000,
    limit: 20,
    message: {
        success: false,
        message: "Too many requests",
    },
});
const bootstap = async () => {
    app.use(express_1.default.json(), (0, cors_1.default)(), limiter, (0, helmet_1.default)());
    await (0, connectionDB_1.default)();
    await redis_connection_js_1.default.connect();
    app.get("/", (req, res, next) => {
        res.status(200).json({ message: `welcome to my app 😎` });
    });
    app.use("/auth", auth_controller_js_1.default);
    app.use("/users", user_controller_js_1.default);
    app.use("{/*demo}", (req, res, next) => {
        throw new globalError_js_1.AppError(`Url :${req.originalUrl} with method:${req.method} not found`, 404);
    });
    app.use(globalError_js_1.globalErrorHandling);
    app.listen(port, () => {
        console.log(`Example app listening on port:${port}`);
    });
};
exports.default = bootstap;
