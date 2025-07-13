import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// import userModel from "../../models/Usermodel.js";
import { errorResponse } from "../../utils/serverResponse.js";
import { randomUUID } from "crypto";
import userModel from "../../models/userModel.js";

const uploadPath = process.env.UPLOAD_PATH || "./uploads";

// Ensure the uploads directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = randomUUID();
    cb(null, `${randomName}${ext}`);
  },
});

// File Type Filter (Only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

const UploadRouter = Router();

// Upload and Update Profile Image
UploadRouter.post("/", uploadMiddleware.single("file"), fileUploadController);

// Retrieve Uploaded File
UploadRouter.get("/:filename", getFileController);

export default UploadRouter;

// 🟢 Upload Profile Image Controller
async function fileUploadController(req, res) {
  try {
    if (!req.file) {
      return errorResponse(res, 400, "No file uploaded");
    }

    const filename = req.file.filename;
    const { userId } = req.body; // ✅ Changed from id to userId

    if (!userId) {
      return errorResponse(res, 400, "User ID is required");
    }

    // Update user profile with new image
    const user = await userModel.findByIdAndUpdate(
      userId,
      { profileimage: filename },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    res
      .status(200)
      .json({ success: true, message: "Profile image updated", filename });
  } catch (error) {
    console.error("fileUploadController Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// 🟢 Serve Uploaded Images Controller
async function getFileController(req, res) {
  try {
    const { filename } = req.params;

    if (!filename) {
      return errorResponse(res, 400, "File name required");
    }

    const filePath = path.resolve(uploadPath, filename);

    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 404, "File not found");
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("getFileController Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}