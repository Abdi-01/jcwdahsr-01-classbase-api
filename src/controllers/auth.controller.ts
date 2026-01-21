import { NextFunction, Request, Response } from "express";

class AuthController {
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {

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