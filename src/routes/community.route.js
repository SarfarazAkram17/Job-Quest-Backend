import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { createCommunityPost, getApprovedCommunityPost, getAllCommunityPost, giveReaction, updateCommunityPostStatus, deleteCommunityPost } from "../controllers/community.controller.js";

const communityRouter = express.Router();

communityRouter.get("/", getApprovedCommunityPost);
communityRouter.get("/all", verifyJwt, verifyAdmin, getAllCommunityPost);
communityRouter.post("/", verifyJwt, createCommunityPost);
communityRouter.patch("/:id/status", verifyJwt, verifyAdmin, updateCommunityPostStatus);
communityRouter.patch("/:id/react", giveReaction);
communityRouter.delete("/:id", verifyJwt, verifyAdmin, deleteCommunityPost);

export default communityRouter;