"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_service_js_1 = require("../../config/config.service.js");
const redis_connection_js_1 = __importDefault(require("../../DB/redis.connection.js"));
const user_repository_js_1 = require("../../DB/repositories/user.repository.js");
const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw Error("token not exist", { cause: 404 });
    }
    const decoded = jsonwebtoken_1.default.verify(authorization, config_service_js_1.ACCESS_TOKEN_SIGNATURE);
    const user = (await new user_repository_js_1.UserRepository().findOne({
        filter: { email: decoded.email.toLowerCase() },
        options: {},
    }));
    if (!user) {
        throw new Error("email not exist", { cause: 404 });
    }
    if (!user?.isConfirmed) {
        throw new Error("user not confirmed yet ", { cause: 404 });
    }
    // if (user?.changeCredentialAt?.getTime() > decoded.iat * 1000!) {
    //     throw new Error("you log out from all devices", { cause: 404 });
    // }
    if ((await redis_connection_js_1.default.ttl(`revoke_token::${user._id}::${decoded.jti}`)) >
        0) {
        throw new Error("you must login in again", { cause: 404 });
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
exports.authentication = authentication;
