import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_SIGNATURE } from "../../config/config.service.js";
import RedisService from "../../DB/redis.connection.js";
import { UserRepository } from "../../DB/repositories/user.repository.js";
import { IUser } from "../../DB/models/user.model.js";
import { HydratedDocument } from "mongoose";
declare global {
    namespace Express {
        interface Request {
            user?: HydratedDocument<IUser>;
            decoded?: jwt.JwtPayload;
        }
    }
}
export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw Error("token not exist", { cause: 404 });
    }

    const decoded = jwt.verify(
        authorization,
        ACCESS_TOKEN_SIGNATURE as jwt.Secret,
    ) as jwt.JwtPayload;
    const user = (await new UserRepository().findOne({
        filter: { email: decoded.email.toLowerCase() },
        options: {},
    }));
    if (!user) {
        throw new Error("email not exist", { cause: 404 });
    }
    if (!(user as IUser)?.isConfirmed) {
        throw new Error("user not confirmed yet ", { cause: 404 });
    }
    // if (user?.changeCredentialAt?.getTime() > decoded.iat * 1000!) {
    //     throw new Error("you log out from all devices", { cause: 404 });
    // }
    if (
        (await RedisService.ttl(`revoke_token::${user._id}::${decoded.jti}`))! >
        0
    ) {
        throw new Error("you must login in again", { cause: 404 });
    }
    req.user = user as HydratedDocument<IUser>;
    req.decoded = decoded;
    next();
};
