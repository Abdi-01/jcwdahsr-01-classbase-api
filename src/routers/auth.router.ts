import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verify";
import { regisSchemaValidation, validationCheck } from "../middleware/validator/auth.validation";

class AuthRouter {
    private route: Router;
    private authController: AuthController;

    constructor() {
        this.route = Router();
        this.authController = new AuthController();
        this.initializeRoute();
    }

    // Private methode for listing endpoint and controller
    private initializeRoute = () => {
        const { register, login, keepLogin } = this.authController;

        this.route.post("/regis", regisSchemaValidation, validationCheck, register);
        this.route.post("/login", login);
        this.route.get("/refresh", verifyToken, keepLogin)
    }

    // public methode for getroute config
    public getRouter = (): Router => {
        return this.route;
    }
}

export default AuthRouter;