import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/users.route.js";
import communityRouter from "./routes/community.route.js";
import reviewsRouter from "./routes/reviews.route.js";
import resumeRouter from "./routes/resume.route.js"; // ✅ FIXED: Import from resume.route.js

app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://job-quest-frontend-lemon.vercel.app", 
      "https://job-quest-frontend-phi.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

async function startServer() {
  try {
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/community", communityRouter);
    app.use("/reviews", reviewsRouter);
    app.use("/resume", resumeRouter); // ✅ This will now work correctly

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();