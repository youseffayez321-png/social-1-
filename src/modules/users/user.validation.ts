import * as z from "zod";
import { GenderEnum } from "../../common/enum/user.enum.js";
export const updateProfileSchema = {
    body: z.object({
        fName: z.string().min(2).max(10),
        lName: z.string().min(2).max(10),
        phone: z.string(),
        age: z.number().min(20).max(60),
        gender: z.string(),
    }),
};