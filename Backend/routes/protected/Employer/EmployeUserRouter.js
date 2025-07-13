import { Router } from "express";
import {
  errorResponse,
  succesResponse,
} from "../../../utils/serverResponse.js";
import jobModel from "../../../models/JobModel.js";
import ApplicationModel from "../../../models/AplicationModel.js";
import userModel from "../../../models/userModel.js";

const EmployeUserRouter = Router();

// Routes

EmployeUserRouter.put("/applications/status", updateApplicationStatus);
EmployeUserRouter.delete("/applications/:applicationId", deleteApplication);
EmployeUserRouter.get("/applications", getUserApplications);

export default EmployeUserRouter;

async function getUserApplications(req, res) {
  try {
    const employerId = res.locals.userId;
    const employeeJobs = await jobModel.find({ employerId });
    
    const jobsIds = employeeJobs.map((job) => job._id);
    
    const applications = await ApplicationModel.find({ jobId: { $in: jobsIds } })
      .populate("jobId")
      .populate("userId", "-password")
      .lean();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Use Promise.all for async operations in map
    const applicationsWithResumes = await Promise.all(applications.map(async (app) => {
      let resumeFilename = app.resumeFilename;
      if (!resumeFilename) {
        const user = await userModel.findById(app.userId._id).select('resume');
        if (user?.resume) {
          resumeFilename = path.basename(user.resume);
          await ApplicationModel.updateOne(
            { _id: app._id },
            { $set: { resumeFilename } }
          );
        }
      }
      
      return {
        ...app,
        resumeUrl: resumeFilename 
          ? `${baseUrl}/api/protected/employee/applications/resume/${resumeFilename}`
          : null,
        hasResume: !!resumeFilename
      };
    }));

    return succesResponse(
      res,
      "Applications retrieved successfully",
      applicationsWithResumes
    );
  } catch (error) {
    console.error("Error fetching applications:", error);
    return errorResponse(res, "Failed to retrieve applications", 500);
  }
}
// Update application status
async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.query;
    const { status } = req.body;

    if (!id || !status) {
      return errorResponse(res, 400, "Application ID and status are required.");
    }

    const validStatuses = ["Pending", "Shortlisted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, "Invalid status value.");
    }

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return errorResponse(res, 404, "Application not found.");
    }

    return succesResponse(
      res,
      "Application status updated successfully.",
      updatedApplication
    );
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Delete an application
async function deleteApplication(req, res) {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return errorResponse(res, 400, "Application ID is required.");
    }

    const deletedApplication = await ApplicationModel.findByIdAndDelete(
      applicationId
    );

    if (!deletedApplication) {
      return errorResponse(res, 404, "Application not found.");
    }

    return succesResponse(res, "Application deleted successfully.");
  } catch (error) {
    console.error("Error in deleteApplication:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
