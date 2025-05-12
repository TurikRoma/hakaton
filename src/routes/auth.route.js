import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlwares/auth.middlwares.js";
import { refreshAccessToken } from "../utils/token.js";
const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.get("/profile", authMiddleware, getProfile);
AuthRouter.post("/refreshToken", refreshAccessToken);

export default AuthRouter;
