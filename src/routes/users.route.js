import express from "express";
import {
  deleteUser,
  getAllUsers,
  getCandidate,
  updateCandidateProfile,
  updateAdminProfile,
  getAdmin,
} from "../controllers/users.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { verifyCandidate } from "../middleware/verifyCandidate.middleware.js";

const userRouter = express.Router();

userRouter.get("/", verifyJwt, verifyAdmin, getAllUsers);

userRouter.get("/candidate/me", verifyJwt, verifyCandidate, getCandidate);

userRouter.patch("/candidate", verifyJwt, verifyCandidate, updateCandidateProfile);

userRouter.get("/admin/me", verifyJwt, verifyAdmin, getAdmin);

userRouter.patch("/admin", verifyJwt, verifyAdmin, updateAdminProfile);

userRouter.delete("/:id", verifyJwt, verifyAdmin, deleteUser);

export default userRouter;