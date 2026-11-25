import { config } from "dotenv";
import { resolve } from "node:path";
const NODE_ENV = process.env.NODE_ENV!;
const envPaths = {
    development: ".env.development",
    production: ".env.production",
};

config({
    path: resolve(envPaths[NODE_ENV as keyof typeof envPaths]) as string,
});

export const PORT = +process.env.PORT!;
export const DB_URI = process.env.DB_URI!;
export const REDIS__URL = process.env.REDIS__URL!;
export const EMAIL = process.env.EMAIL!;
export const PASSWORD = process.env.PASSWORD!;
export const ENCRYPTION_KEYS = process.env.ENCRYPTION_KEYS!;
export const SALT_ROUNDS = +process.env.SALT_ROUNDS!;
export const ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE;
export const REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE;