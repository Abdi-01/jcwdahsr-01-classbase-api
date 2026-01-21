import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";

class AuthController {
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const check = await prisma.account.findUnique({
                where: {
                    email: req.body.email
                }
            })

            if (check) {
                // return res.status(400).send({ success: false, message: "Email exist" });
                throw { rc: 400, success: false, message: "Email exist" }
            }

            const newAccount = await prisma.account.create({
                data: { ...req.body, password: await hashPassword(req.body.password) }
            })

            res.status(200).send({
                success: true,
                message: "Register success"
            })
        } catch (error) {
            next(error);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error);
        }
    }

    public keepLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).send("Keeplogin test")
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;