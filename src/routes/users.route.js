import express from "express";
import {
  getAllUsers,
  // updateProfile,
} from "../controllers/users.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const userRouter = express.Router();

userRouter.get("/", verifyJwt, verifyAdmin, getAllUsers);

// userRouter.patch("/", verifyJwt, updateProfile);

export default userRouter;