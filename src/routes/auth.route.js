import express from "express";
import { check, login, logout, signup } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", verifyJwt, check);

export default authRouter;