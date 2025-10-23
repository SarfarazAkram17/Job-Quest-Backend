import express from "express";
import {
  deleteUser,
  getAllUsers,
  getCandidate,
  updateCandidateProfile,
} from "../controllers/users.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { verifyCandidate } from "../middleware/verifyCandidate.middleware.js";

const userRouter = express.Router();

userRouter.get("/", verifyJwt, verifyAdmin, getAllUsers);

userRouter.get("/candidate/me", verifyJwt, verifyCandidate, getCandidate);

userRouter.patch("/candidate", verifyJwt, verifyCandidate, updateCandidateProfile);

// userRouter.patch("/employer/:id", verifyJwt, updateProfile);

userRouter.delete("/:id", verifyJwt, verifyAdmin, deleteUser);

export default userRouter;