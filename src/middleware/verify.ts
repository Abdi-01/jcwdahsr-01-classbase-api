import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw { rc: 404, success: false, message: "Token not exist" }
        }

        const decript = verify(token, process.env.SECRET || "secret");

        res.locals.decript = decript;

        next();
    } catch (error) {
        next(error);
    }
}