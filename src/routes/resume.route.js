import express from "express";
import multer from "multer";
import { GridFSBucket, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";
import { getDatabase } from "../config/db.js";

dotenv.config();

const router = express.Router();

// GridFS bucket (initialized lazily)
let gfsBucket;

async function initializeGridFS() {
  if (!gfsBucket) {
    const db = await getDatabase();
    gfsBucket = new GridFSBucket(db, { bucketName: "resumes" });
  }
  return gfsBucket;
}

// Use regular multer with memory storage, then manually upload to GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and Word documents are allowed."));
    }
  },
});

// ==============================
// Upload Resume
// POST /resume/upload
// ==============================
router.post("/upload", verifyJwt,  upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid file type.",
      });
    }

    // Initialize GridFS
    const bucket = await initializeGridFS();

    // Create a filename
    const filename = `${Date.now()}-${req.file.originalname}`;

    // Create upload stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        email: req.user.email,
        originalName: req.file.originalname,
        contentType: req.file.mimetype,
      },
    });

    // Write the file buffer to GridFS
    uploadStream.end(req.file.buffer);

    // Wait for upload to complete
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        _id: uploadStream.id,
        filename: filename,
        originalName: req.file.originalname,
        length: req.file.size,
        contentType: req.file.mimetype,
        uploadDate: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
      error: error.message,
    });
  }
});

// ==============================
// Get User's Resumes
// GET /resume/
// ==============================
router.get("/", verifyJwt,  async (req, res) => {
  try {
    const db = await getDatabase();
    
    const files = await db
      .collection("resumes.files")
      .find({ "metadata.email": req.user.email })
      .toArray();

    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch resumes.",
      error: error.message 
    });
  }
});

// ==============================
// View / Stream Resume
// GET /resume/view/:id
// ==============================
router.get("/view/:id", verifyJwt,  async (req, res) => {
  try {
    const db = await getDatabase();
    const bucket = await initializeGridFS();
    const fileId = new ObjectId(req.params.id);

    const file = await db
      .collection("resumes.files")
      .findOne({ _id: fileId, "metadata.email": req.user.email });

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: "File not found or unauthorized." 
      });
    }

    res.set(
      "Content-Type",
      file.contentType || file.metadata.contentType || "application/pdf"
    );
    res.set(
      "Content-Disposition",
      `inline; filename="${file.metadata.originalName}"`
    );

    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on("error", (error) => {
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: "File not found" });
      }
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: "Error retrieving file.",
        error: error.message 
      });
    }
  }
});

// ==============================
// Download Resume
// GET /resume/download/:id
// ==============================
router.get("/download/:id", verifyJwt,  async (req, res) => {
  try {
    const db = await getDatabase();
    const bucket = await initializeGridFS();
    const fileId = new ObjectId(req.params.id);

    const file = await db
      .collection("resumes.files")
      .findOne({ _id: fileId, "metadata.email": req.user.email });

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: "File not found or unauthorized." 
      });
    }

    res.set(
      "Content-Type",
      file.contentType || file.metadata.contentType || "application/octet-stream"
    );
    res.set(
      "Content-Disposition",
      `attachment; filename="${file.metadata.originalName}"`
    );

    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on("error", (error) => {
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: "File not found" });
      }
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to download file.",
        error: error.message 
      });
    }
  }
});

// ==============================
// Delete Resume
// DELETE /resume/:id
// ==============================
router.delete("/:id", verifyJwt,  async (req, res) => {
  try {
    const db = await getDatabase();
    const bucket = await initializeGridFS();
    const fileId = new ObjectId(req.params.id);

    const file = await db
      .collection("resumes.files")
      .findOne({ _id: fileId, "metadata.email": req.user.email });

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        message: "File not found or unauthorized." 
      });
    }

    await bucket.delete(fileId);
    
    res.json({ 
      success: true, 
      message: "Resume deleted successfully." 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete resume.",
      error: error.message 
    });
  }
});

export default router;