import express from "express";
import {
  deleteUser,
  getAllUsers,
  // updateProfile,
} from "../controllers/users.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const userRouter = express.Router();

userRouter.get("/", verifyJwt, verifyAdmin, getAllUsers);

// userRouter.patch("/", verifyJwt, updateProfile);

userRouter.delete("/", verifyJwt, verifyAdmin, deleteUser);

export default userRouter;