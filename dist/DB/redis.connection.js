"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_service_js_1 = require("../config/config.service.js");
const client = (0, redis_1.createClient)({
    url: config_service_js_1.REDIS__URL,
});
class RedisService {
    redis_client = client;
    constructor() {
        // this.handleEvent();
    }
    // handleEvent() {
    //     this.redis_client.on("error", (error) => {
    //         console.log(`redis error:${error.message}`);
    //     });
    // }
    async connect() {
        await this.redis_client.connect();
        console.log("redis connected successfully");
    }
    setValue = async ({ key, value, ttl, }) => {
        try {
            if (typeof value == "string") {
                value = value;
            }
            else {
                value = JSON.stringify(value);
            }
            if (ttl) {
                return await this.redis_client.set(key, value, { EX: ttl });
            }
            else {
                return await this.redis_client.set(key, value);
            }
        }
        catch (error) {
            console.log("\nredis set failed");
        }
    };
    update = async ({ key, value, ttl, }) => {
        try {
            if (!(await this.redis_client.exists(key)))
                return 0;
            if (typeof value == "string") {
                value = value;
            }
            else {
                value = JSON.stringify(value);
            }
            if (ttl) {
                return await this.redis_client.set(key, value, { EX: ttl });
            }
            else {
                return await this.redis_client.set(key, value);
            }
        }
        catch (error) {
            console.log("\nredis set failed");
        }
    };
    getValue = async (key) => {
        try {
            try {
                return JSON.parse((await this.redis_client.get(key)));
            }
            catch (error) {
                return await this.redis_client.get(key);
            }
        }
        catch (error) {
            console.log("\nredis get failed");
        }
    };
    ttl = async (key) => {
        try {
            return await this.redis_client.ttl(key);
        }
        catch (error) {
            console.log("\nredis ttl failed");
        }
    };
    expire = async ({ key, ttl }) => {
        try {
            return await this.redis_client.expire(key, ttl);
        }
        catch (error) {
            console.log("\nredis expire failed");
        }
    };
    exists = async (key) => {
        try {
            return await this.redis_client.exists(key);
        }
        catch (error) {
            console.log("\nredis exists failed");
        }
    };
    deleteKey = async (key) => {
        try {
            if (!key?.length)
                return 0;
            return await this.redis_client.del(key);
        }
        catch (error) {
            console.log("\nredis deleted failed");
        }
    };
    keys = async (key) => {
        try {
            return await this.redis_client.keys(`${key}*`);
        }
        catch (error) {
            console.log("\nredis keys failed");
        }
    };
    incr = async (key) => {
        try {
            return await this.redis_client.incr(key);
        }
        catch (error) {
            console.log("\nredis incr failed");
        }
    };
}
exports.default = new RedisService;
