"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_repository_js_1 = require("./db.repository.js");
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
class UserRepository extends db_repository_js_1.DBRepository {
    model;
    constructor(model = user_model_js_1.default) {
        super(model);
        this.model = model;
    }
    createUser = async (data) => {
        return await this.model.create([data]);
    };
}
exports.UserRepository = UserRepository;
