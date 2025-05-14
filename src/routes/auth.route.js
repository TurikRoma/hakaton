import express from "express";
import {
  register,
  login,
  registerAdmin,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import { refreshAccessToken } from "../utils/token.js";
import { getProfile } from "../controllers/general.controllers.js";
const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/register/admin", registerAdmin);
AuthRouter.post("/login", login);
AuthRouter.get("/profile", authMiddleware, getProfile);
AuthRouter.post("/refreshToken", refreshAccessToken);

export default AuthRouter;
