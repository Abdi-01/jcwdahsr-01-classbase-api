import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compare } from "bcrypt";
import { createToken } from "../utils/createToken";
import transport from "../config/nodemailer";
import { regisTemplate } from "../templates/regis.template";

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

            // send email

            await transport.sendMail({
                from: process.env.MAIL_SENDER,
                to: newAccount.email,
                subject: "Registration info",
                html: regisTemplate(newAccount.name)
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
            const { email, password } = req.body;
            // 2. filter to prisma.account
            const account = await prisma.account.findUnique({
                where: {
                    email
                }
            })

            if (!account) {
                throw { rc: 404, success: false, message: "Account not found" }
            }

            // 3. compare password
            const checkPassword = await compare(password, account?.password as string);
            if (!checkPassword) {
                throw { rc: 401, success: false, message: "Wrong password" }
            }

            // create token
            const token = createToken({ id: account.id });

            res.status(200).send({
                name: account.name,
                email: account.email,
                gender: account.gender,
                age: account.age,
                token
            });
        } catch (error) {
            next(error);
        }
    }

    public keepLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = res.locals.decript;

            const account = await prisma.account.findUnique({
                where: {
                    id: Number(id)
                }
            })

            if (!account) {
                throw { rc: 401, success: false, message: "Unautorized token" }
            }
            // create token
            const token = createToken({ id: account.id });

            res.status(200).send({
                name: account.name,
                email: account.email,
                gender: account.gender,
                age: account.age,
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;