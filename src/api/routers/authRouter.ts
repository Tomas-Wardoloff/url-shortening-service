import { Router } from "express";

import { authMiddleware } from "../middlewares/authenticationMiddleware.js";
import AuthCotroller from "../controllers/authController.js";

class AuthRouter {
  private router = Router();
  private authController = new AuthCotroller();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup", this.authController.signup);
    this.router.post("/login", this.authController.login);
    this.router.post("/logout", authMiddleware, this.authController.logout);
    this.router.post(
      "/refresh-token",
      authMiddleware,
      this.authController.refresh
    );
    this.router.get("/verify-email", this.authController.verifyEmail);
  }

  public getRouter() {
    return this.router;
  }
}

export default AuthRouter;
