import express from "express";
import { check, login, logout, signup, updatePassword } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", verifyJwt, check);
authRouter.patch("/update-password", verifyJwt, updatePassword);

export default authRouter;