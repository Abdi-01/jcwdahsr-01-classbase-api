import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verify";
import {
  regisSchemaValidation,
  validationCheck,
} from "../middleware/validator/auth.validation";
import { uploader } from "../middleware/uploader";

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
    const { register, login, keepLogin, uploadImgProfile, getAllAccount } =
      this.authController;

    this.route.get("/get-all", getAllAccount);

    this.route.post("/login", login);
    this.route.post("/regis", regisSchemaValidation, validationCheck, register);
    this.route.get("/refresh", verifyToken, keepLogin);

    this.route.patch(
      "/img-profile",
      verifyToken,
      uploader("IMGP", "/images").single("img"),
      uploadImgProfile,
    );
  };

  // public methode for getroute config
  public getRouter = (): Router => {
    return this.route;
  };
}

export default AuthRouter;
