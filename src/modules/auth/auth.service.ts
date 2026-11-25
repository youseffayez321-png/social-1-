import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../../DB/models/user.model.js";
import { AppError } from "../../common/utils/globalError.js";
import { UserRepository } from "../../DB/repositories/user.repository.js";
import RedisService from "../../DB/redis.connection.js";
import { Compare, Hash } from "../../common/security/hash.js";
import { generate_otp, sendEmail } from "../../common/service/sendEmail.js";
import {
    ACCESS_TOKEN_SIGNATURE,
    REFRESH_TOKEN_SIGNATURE,
} from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
class AuthService {
    private readonly _UserRepo = new UserRepository();
    constructor() {}
    //========================================== 1 sign UP =======================================
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { email, fName, lName, password, gender, phone, age }: IUser =
            req.body;
        const emailExist = await this._UserRepo.findOne({
            filter: { email },
            options: {},
        } as any);
        if (emailExist) throw new AppError("email already exist", 409);
        const otp = generate_otp();
        const otpHash = await Hash(otp);
        await RedisService.setValue({
            key: `otp::${email}`,
            value: otpHash,
            ttl: 5 * 60, // 5 minutes
        });
        await RedisService.setValue({
            key: `otp::max::${email}`,
            value: 1,
            ttl: 5 * 60, // 5 minutes
        });
        await sendEmail({
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
        } as Partial<IUser>);
        res.status(200).json({ message: `done`, user });
    };
    //========================================== 2 confirm email =======================================

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;
        const otpValue = await RedisService.getValue(`otp::${email}` as string);
        console.log(otpValue);
        if (!otpValue) {
            throw new Error("otp expire", { cause: 400 });
        }
        if (!(await Compare(otp, otpValue))) {
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
        await RedisService.deleteKey(`otp::${email}`);
        res.status(200).json({ message: "email confirmed" });
    };
    //========================================== 3 sign IN =======================================

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if ((await RedisService.ttl(`blocked::${email}`))! > 0) {
            await RedisService.deleteKey(`attempts::${email}`);
            throw new Error(
                `try again later after ${await RedisService.ttl(`blocked::${email}`)}`,
            );
        }
        if ((await RedisService.getValue(`attempts::${email}`)) >= 5) {
            await RedisService.setValue({
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
        if (!(await Compare(password, (user as IUser).password))) {
            await RedisService.incr(`attempts::${email}`);
            throw new Error("invalid password", { cause: 400 });
        }
        const tokenId = randomUUID();

        const access_token = jwt.sign(
            { id: user.id, email: (user as IUser).email },
            ACCESS_TOKEN_SIGNATURE as  jwt.Secret,
            {
                jwtid: tokenId,
                expiresIn: "1d",
                audience: "http://localhost:4200",
                issuer: "http://localhost:3000",
            },
        );
        const refresh_token = jwt.sign(
            { id: user.id, email: (user as IUser).email },
            REFRESH_TOKEN_SIGNATURE as jwt.Secret,
            {
                jwtid: tokenId,
            },
        );
        res.status(200).json({ message: "done", access_token, refresh_token });
    };
    //========================================== 4 refresh Token =======================================
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        console.log(req.headers);
        if (!authorization) {
            throw Error("token not exist", { cause: 404 });
        }
        const decoded = jwt.verify(
            authorization,
            ACCESS_TOKEN_SIGNATURE as jwt.Secret,
        ) as jwt.JwtPayload;
        const user = await this._UserRepo.findOne({
            filter: { _id: decoded.id },
            options: {},
        });
        if (!user) {
            throw new Error("email not exist", { cause: 404 });
        }
        const access_token = jwt.sign(
            { id: user.id, email: (user as IUser).email },
            ACCESS_TOKEN_SIGNATURE as jwt.Secret,
            {
                expiresIn: 60 * 5,
                audience: "http://localhost:4200",
                issuer: "http://localhost:3000",
            },
        );
    };
    //========================================== 5 reset Password =======================================
    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email, code, password } = req.body;
        const otpValue = await RedisService.getValue(`otp::${email}`);
        if (!otpValue) throw new Error("otp expire");
        if (!(await Compare(code, otpValue))) {
            throw new Error("invalid otp");
        }
        await this._UserRepo.findOneAndUpdate({
            filter: { email, isCofirmed: { $exists: true } },
            update: {
                password: await Hash(password),
                changeCredentialAt: new Date(),
            },
            options: {},
        });
        await RedisService.deleteKey(`otp::${email}`);
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

export default new AuthService();
