import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


export const regisSchemaValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().isEmail().withMessage("Email is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("password").notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage("Password is required")
]

export const validationCheck = (req: Request, res: Response, next: NextFunction) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw { rc: 400, errors: errors.array() }
        }
        next();// melanjutkan data ke controller ketika tidak terdeteksi error
    } catch (error) {
        next(error);
    }
}