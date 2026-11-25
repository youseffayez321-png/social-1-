import { Router } from "express";
import AS from "./auth.service.js";
import validation from "../../common/middleware/validation.js";
import { confirmEmailSchema, resetPasswordSchema, signInSchema, signUpSchema } from "./auth.validation.js";
// import { authentication } from "../../common/middleware/authentication.js";
const authRouter = Router();

authRouter.post("/signUp",validation(signUpSchema),AS.signUp)
authRouter.post("/confirmEmail",validation(confirmEmailSchema),AS.confirmEmail)
authRouter.post("/signIn",validation(signInSchema),AS.signIn)
authRouter.post("/resetPassword",validation(resetPasswordSchema),AS.resetPassword)
// authRouter.post("/refreshToken",validation(refreshTokenSchema),AS.refreshToken)


export default authRouter