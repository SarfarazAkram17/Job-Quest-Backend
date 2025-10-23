import express from "express";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { addSubscription, deleteSubscription, getAllSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", verifyJwt, getAllSubscriptions);

subscriptionRouter.post("/", verifyJwt, verifyAdmin, addSubscription);

subscriptionRouter.patch("/:id", verifyJwt, verifyAdmin, updateSubscription);

subscriptionRouter.delete("/:id", verifyJwt, verifyAdmin, deleteSubscription);

export default subscriptionRouter;