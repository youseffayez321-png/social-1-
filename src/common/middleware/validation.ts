import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/globalError.js";
type ReqType = keyof Request;
type SchemaType = Partial<Record<ReqType, ZodType>>;
const validation = (schema: SchemaType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultErrors = [];
        for (const key of Object.keys(schema) as ReqType[]) {
            if (!schema[key]) continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                resultErrors.push(result.error.message);
            }
        }
        if (resultErrors.length > 0)
            throw new AppError(JSON.parse(resultErrors as any), 400);
        next();
    };
};
export default validation;
