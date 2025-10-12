import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { createCommunityPost, getApprovedCommunityPost, getAllCommunityPost, giveReaction, updateCommunityPostStatus, deleteCommunityPostStatus } from "../controllers/community.controller.js";

const communityRouter = express.Router();

communityRouter.get("/", getApprovedCommunityPost);
communityRouter.get("/all", getAllCommunityPost);
communityRouter.post("/", verifyJwt, createCommunityPost);
communityRouter.patch("/:id/status", verifyJwt, verifyAdmin, updateCommunityPostStatus);
communityRouter.patch("/:id/react", verifyJwt, giveReaction);
communityRouter.delete("/:id", verifyJwt, deleteCommunityPostStatus);

export default communityRouter;