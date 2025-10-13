import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import {
  createReviewPost,
  getApprovedReviewPost,
  deleteReviewPost,
  getAllReviewPost,
  updateReviewPostStatus,
} from "../controllers/reviews.controller.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getApprovedReviewPost);
reviewsRouter.get("/all", verifyJwt, verifyAdmin, getAllReviewPost);
reviewsRouter.post("/", verifyJwt, createReviewPost);
reviewsRouter.patch("/:id/status", verifyJwt, verifyAdmin, updateReviewPostStatus);
reviewsRouter.delete("/:id", verifyJwt, verifyAdmin, deleteReviewPost);

export default reviewsRouter;