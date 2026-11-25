"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_SIGNATURE = exports.ACCESS_TOKEN_SIGNATURE = exports.SALT_ROUNDS = exports.ENCRYPTION_KEYS = exports.PASSWORD = exports.EMAIL = exports.REDIS__URL = exports.DB_URI = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
const node_path_1 = require("node:path");
const NODE_ENV = process.env.NODE_ENV;
const envPaths = {
    development: ".env.development",
    production: ".env.production",
};
(0, dotenv_1.config)({
    path: (0, node_path_1.resolve)(envPaths[NODE_ENV]),
});
exports.PORT = +process.env.PORT;
exports.DB_URI = process.env.DB_URI;
exports.REDIS__URL = process.env.REDIS__URL;
exports.EMAIL = process.env.EMAIL;
exports.PASSWORD = process.env.PASSWORD;
exports.ENCRYPTION_KEYS = process.env.ENCRYPTION_KEYS;
exports.SALT_ROUNDS = +process.env.SALT_ROUNDS;
exports.ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE;
exports.REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE;
