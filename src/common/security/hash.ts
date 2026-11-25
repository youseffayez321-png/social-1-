import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../../config/config.service.js";

export const Hash = async (plainText:string, salt_rounds:number=SALT_ROUNDS) => {
    return await bcrypt.hashSync(plainText, salt_rounds);
};

export const Compare = async (plainText:string, cipherText:string) => {
    return await bcrypt.compareSync(plainText, cipherText);
};