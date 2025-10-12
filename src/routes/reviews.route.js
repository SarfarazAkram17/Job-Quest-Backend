import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";

const reviewsRouter = express.Router();

// reviewsRouter.post("/", verifyJwt,);

export default reviewsRouter;