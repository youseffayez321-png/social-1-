"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalError_js_1 = require("../../common/utils/globalError.js");
const user_repository_js_1 = require("../../DB/repositories/user.repository.js");
const redis_connection_js_1 = __importDefault(require("../../DB/redis.connection.js"));
const hash_js_1 = require("../../common/security/hash.js");
const sendEmail_js_1 = require("../../common/service/sendEmail.js");
const config_service_js_1 = require("../../config/config.service.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
class AuthService {
    _UserRepo = new user_repository_js_1.UserRepository();
    constructor() { }
    //========================================== 1 sign UP =======================================
    signUp = async (req, res, next) => {
        const { email, fName, lName, password, gender, phone, age } = req.body;
        const emailExist = await this._UserRepo.findOne({ email });
        if (emailExist)
            throw new globalError_js_1.AppError("email already exist", 409);
        const otp = (0, sendEmail_js_1.generate_otp)();
        const otpHash = await (0, hash_js_1.Hash)(otp);
        await redis_connection_js_1.default.setValue({
            key: `otp::${email}`,
            value: otpHash,
            ttl: 5 * 60, // 5 minutes
        });
        await redis_connection_js_1.default.setValue({
            key: `otp::max::${email}`,
            value: 1,
            ttl: 5 * 60, // 5 minutes
        });
        await (0, sendEmail_js_1.sendEmail)({
            to: email,
            subject: "confirm",
            html: `<h1>${otp}</h1>`,
        });
        const user = await this._UserRepo.createUser({
            email,
            fName,
            lName,
            password,
            gender,
            phone,
            age,
        });
        res.status(200).json({ message: `done`, user });
    };
    //========================================== 2 confirm email =======================================
    confirmEmail = async (req, res, next) => {
        const { email, otp } = req.body;
        const otpValue = await redis_connection_js_1.default.getValue(`otp::${email}`);
        console.log(otpValue);
        if (!otpValue) {
            throw new Error("otp expire", { cause: 400 });
        }
        if (!(await (0, hash_js_1.Compare)(otp, otpValue))) {
            throw new Error("invalid otp", { cause: 400 });
        }
        const user = await this._UserRepo.findOneAndUpdate({
            filter: {
                email,
                isConfirmed: { $exists: false },
            },
            update: { isConfirmed: true },
            options: {},
        });
        if (!user) {
            throw new Error("user not exist or email already confirmed", {
                cause: 404,
            });
        }
        await redis_connection_js_1.default.deleteKey(`otp::${email}`);
        res.status(200).json({ message: "email confirmed" });
    };
    //========================================== 3 sign IN =======================================
    signIn = async (req, res, next) => {
        const { email, password } = req.body;
        if ((await redis_connection_js_1.default.ttl(`blocked::${email}`)) > 0) {
            await redis_connection_js_1.default.deleteKey(`attempts::${email}`);
            throw new Error(`try again later after ${await redis_connection_js_1.default.ttl(`blocked::${email}`)}`);
        }
        if ((await redis_connection_js_1.default.getValue(`attempts::${email}`)) >= 5) {
            await redis_connection_js_1.default.setValue({
                key: `blocked::${email}`,
                value: 1,
                ttl: 5 * 60,
            });
            throw new Error("try again later");
        }
        const user = await this._UserRepo.findOne({
            filter: {
                email: email.toLowerCase(),
                isConfirmed: { $exists: true },
            },
            options: {},
        });
        if (!user) {
            throw new Error("email not exist", { cause: 404 });
        }
        if (!(await (0, hash_js_1.Compare)(password, user.password))) {
            await redis_connection_js_1.default.incr(`attempts::${email}`);
            throw new Error("invalid password", { cause: 400 });
        }
        const tokenId = (0, crypto_1.randomUUID)();
        const access_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_service_js_1.ACCESS_TOKEN_SIGNATURE, {
            jwtid: tokenId,
            expiresIn: "1d",
            audience: "http://localhost:4200",
            issuer: "http://localhost:3000",
        });
        const refresh_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_service_js_1.REFRESH_TOKEN_SIGNATURE, {
            jwtid: tokenId,
        });
        res.status(200).json({ message: "done", access_token, refresh_token });
    };
    //========================================== 4 refresh Token =======================================
    refreshToken = async (req, res, next) => {
        const { authorization } = req.headers;
        console.log(req.headers);
        if (!authorization) {
            throw Error("token not exist", { cause: 404 });
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, config_service_js_1.ACCESS_TOKEN_SIGNATURE);
        const user = await this._UserRepo.findOne({
            filter: { _id: decoded.id },
            options: {},
        });
        if (!user) {
            throw new Error("email not exist", { cause: 404 });
        }
        const access_token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_service_js_1.ACCESS_TOKEN_SIGNATURE, {
            expiresIn: 60 * 5,
            audience: "http://localhost:4200",
            issuer: "http://localhost:3000",
        });
    };
    //========================================== 5 reset Password =======================================
    resetPassword = async (req, res, next) => {
        const { email, code, password } = req.body;
        const otpValue = await redis_connection_js_1.default.getValue(`otp::${email}`);
        if (!otpValue)
            throw new Error("otp expire");
        if (!(await (0, hash_js_1.Compare)(code, otpValue))) {
            throw new Error("invalid otp");
        }
        await this._UserRepo.findOneAndUpdate({
            filter: { email, isCofirmed: { $exists: true } },
            update: {
                password: await (0, hash_js_1.Hash)(password),
                changeCredentialAt: new Date(),
            },
            options: {},
        });
        await redis_connection_js_1.default.deleteKey(`otp::${email}`);
        return res.status(200).json({ message: "done" });
    };
}
// signUp = async (req: Request, res: Response, next: NextFunction) => {
//     const { email, fName, lName, password, gender, phone, age }: IUser =
//         req.body;
//     const emailExist = await this._UserRepo.findOne({ email } as any);
//     if (emailExist) throw new AppError("email already exist", 409);
//     const user = new userModel({
//         email,
//         fName,
//         lName,
//         password,
//         gender,
//         phone,
//         age,
//     } as Partial<IUser>);
//     await user.save();
//     await user.save();
//     user.age = 30;
//     res.status(200).json({ message: `done`, user });
// };
// test = async (req: Request, res: Response, next: NextFunction) => {
//     //     const user = new userModel({
//     //         email: `yousef${Date.now()}@gamil.com`,
//     //         fName: "yousef2",
//     //         lName: "fayez",
//     //         password: "123456789",
//     //         gender: GenderEnum.male,
//     //         phone: "01012548455",
//     //         age:25,
//     //         isDeleted: true,
//     //     } as Partial<IUser>);
//     //     await user.save();
//     //     user.age=30
//     //     await user.save();
//     //     res.status(200).json({ message: `done`, user });
//     // };
//     // =============================================
//     const users = await userModel.find({
//         fName: "yousef2",
//         paranoid: true,
//     } as any);
//     res.status(200).json({ message: `done`, users });
// };
exports.default = new AuthService();
