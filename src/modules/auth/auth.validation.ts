import * as z from "zod";
import { GenderEnum } from "../../common/enum/user.enum.js";
export const signUpSchema = {
    body: z
        .strictObject({
            fName: z.string().min(3).max(20).trim(),
            lName: z.string().min(3).max(20).trim(),
            email: z.string().trim().email(),
            password: z.string(),
            cPassword: z.string(),
            phone: z.string(),
            gender: z.enum(GenderEnum),
            age: z.number().min(18).max(60),
        })
        .superRefine((val, ctx) => {
            if (val.password !== val.cPassword) {
                ctx.addIssue({
                    code: "custom",
                    message: "password and confrim password must be the same",
                    origin: ["cPassword"],
                });
            }
        }),
};
export const confirmEmailSchema = {
    body: z.strictObject({
        email: z.string().trim().email(),
        otp: z.string().regex(/^[0-9]{6}$/),
    }),
};
export const signInSchema = {
    body: z.strictObject({
        email: z.string().trim().email(),
        password: z.string(),
    }),
};
export const resetPasswordSchema = {
    body: z.strictObject({
        email: z.string().trim().email(),
        code: z.string().regex(/^[0-9]{6}$/),
        password: z.string(),
    }),
};
