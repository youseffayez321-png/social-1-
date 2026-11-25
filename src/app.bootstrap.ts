import { PORT } from "./config/config.service.js";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { AppError, globalErrorHandling } from "./common/utils/globalError.js";
import authRouter from "./modules/auth/auth.controller.js";
import connectionDB from "./DB/connectionDB";
import RedisService from "./DB/redis.connection.js";
import userRouter from "./modules/users/user.controller.js";
const app = express();
const port = PORT;
const limiter = rateLimit({
    windowMs: 60 * 5 * 1000,
    limit: 20,
    message: {
        success: false,
        message: "Too many requests",
    },
});
const bootstap = async () => {
    app.use(express.json(), cors(), limiter, helmet());
    await connectionDB();
    await RedisService.connect();
    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ message: `welcome to my app 😎` });
    });
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        throw new AppError(
            `Url :${req.originalUrl} with method:${req.method} not found`,
            404,
        );
    });

    app.use(globalErrorHandling);
    app.listen(port, () => {
        console.log(`Example app listening on port:${port}`);
    });
};
export default bootstap;
