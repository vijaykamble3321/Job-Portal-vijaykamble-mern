import { Router } from "express";
import jobModel from "../../../models/JobModel.js";
import multer from "multer";
import userModel from "../../../models/userModel.js";
import {
  errorResponse,
  succesResponse,
} from "../../../utils/serverResponse.js";
import ApplicationModel from "../../../models/AplicationModel.js";
// import userProfileModel from "../../../models/userProfileModel.js";
import { isValidObjectId } from "mongoose";
import fs from "fs";
import path from "path";
import userProfileModel from "../../../models/Userprofile.js";

const UserjobRouter = Router();

// Ensure upload directories exist
const ensureUploadDirectoriesExist = () => {
  const profileDir = path.join(process.cwd(), "uploads/profile");
  const resumeDir = path.join(process.cwd(), "uploads/resume");

  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
  }
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
};

ensureUploadDirectoriesExist();

// Profile image upload configuration
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadProfile = multer({ storage: profileStorage });

// Resume upload configuration
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resume");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadResume = multer({ storage: resumeStorage });

// Routes
UserjobRouter.post("/upload-resume",uploadResume.single("resume"),uploadResumeController);
UserjobRouter.post("/upload-profile",uploadProfile.single("profileimage"),imageController);
UserjobRouter.get("/jobs", getAllJobsController);
UserjobRouter.get("/jobs-response", getMyApplications);
UserjobRouter.post("/apply", applyForJobController);
UserjobRouter.post("/create-profile", UserProfileController);
UserjobRouter.get("/profile", getUserProfileController);

// Export the router
export default UserjobRouter;

// Controllers
async function getUserProfileController(req, res) {
  try {
    const userId = res.locals.userId;

    const profile = await userProfileModel.findOne({ userId });

    if (!profile) {
      return errorResponse(res, 404, "Profile not found for this user.");
    }

    return succesResponse(res, "Profile fetched successfully.", profile);
  } catch (error) {
    console.error("Error in getUserProfileController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}



async function UserProfileController(req, res) {
  try {
    // Extract data from the request body (excluding userId)
    const { fullname, skills, experience, education, phone } = req.body;

    // Fetch userId from res.locals (set by authentication middleware)
    const userId = res.locals.userId;

    // Validate required fields
    if (!fullname || !skills || !experience || !education || !phone) {
      return errorResponse(res, 400, "All fields are required.");
    }

    // Check if the user already has a profile
    const existingProfile = await userProfileModel.findOne({ userId });
    if (existingProfile) {
      return errorResponse(res, 400, "Profile already exists for this user.");
    }

    // Create a new profile
    const newProfile = new userProfileModel({
      userId,
      fullname,
      skills,
      experience,
      education,
      phone,
    });

    await newProfile.save();
    return succesResponse(res, "Profile created successfully.", newProfile);
  } catch (error) {
    console.error("Error in create-profile route:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function imageController(req, res) {
  try {
    const userId = res.locals.userId;
    if (!req.file) {
      return errorResponse(res, 400, "No file uploaded.");
    }

    const profileImagePath = req.file.path;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profileimage: profileImagePath },
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse(res, 404, "User not found.");
    }

    return succesResponse(
      res,
      "Profile image uploaded successfully.",
      updatedUser
    );
  } catch (error) {
    console.error("Error in imageController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function uploadResumeController(req, res) {
  try {
    const userId = res.locals.userId;

    if (!req.file) {
      return errorResponse(res, 400, "No file uploaded.");
    }

    const resumePath = req.file.path;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { resume: resumePath },
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse(res, 404, "User not found.");
    }

    return succesResponse(res, "Resume uploaded successfully.", updatedUser);
  } catch (error) {
    console.error("Error in uploadResumeController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function getAllJobsController(req, res) {
  try {
    const jobs = await jobModel.find({});
    return succesResponse(res, "Jobs retrieved successfully.", jobs);
  } catch (error) {
    console.error("Error in getAllJobsController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function getMyApplications(req, res) {
  try {
    const userId = res.locals.userId;
    const applications = await ApplicationModel.find({ userId })
      .populate("jobId")
      .populate("userId");

    if (applications.length === 0) {
      return succesResponse(res, "No applications found for this user.", []);
    }

    return succesResponse(
      res,
      "Applications retrieved successfully.",
      applications
    );
  } catch (error) {
    console.error("Error in getMyApplications:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function applyForJobController(req, res) {
  try {
    const { jobId, fullName, email, coverLetter } = req.body;
    const userId = res.locals.userId;

    // Validate job ID
    if (!isValidObjectId(jobId)) {
      return errorResponse(res, 400, "Invalid job ID.");
    }

    // Validate required fields
    if (!fullName || !email || !coverLetter) {
      return errorResponse(res, 400, "Full Name, Email, and Cover Letter are required.");
    }

    // Check if job exists
    const job = await jobModel.findById(jobId);
    if (!job) return errorResponse(res, 404, "Job not found.");

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) return errorResponse(res, 404, "User not found.");

    // Check for existing application
    const existingApplication = await ApplicationModel.findOne({
      jobId,
      userId,
    });
    if (existingApplication) {
      return errorResponse(res, 400, "You have already applied for this job.");
    }

    // Create new application
    const newApplication = await ApplicationModel.create({
      jobId,
      userId,
      fullName,
      email,
      coverLetter,
      status: "Pending",
    });

    return succesResponse(
      res,
      "Application submitted successfully.",
      newApplication
    );
  } catch (error) {
    console.error("Error in applyForJobController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}