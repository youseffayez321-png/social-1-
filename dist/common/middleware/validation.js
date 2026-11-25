"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalError_js_1 = require("../utils/globalError.js");
const validation = (schema) => {
    return (req, res, next) => {
        const resultErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                resultErrors.push(result.error.message);
            }
        }
        if (resultErrors.length > 0)
            throw new globalError_js_1.AppError(JSON.parse(resultErrors), 400);
        next();
    };
};
exports.default = validation;
