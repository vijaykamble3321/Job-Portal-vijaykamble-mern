import { Router } from "express";
import jobModel from "../../../models/JobModel.js";
import employeModel from "../../../models/EmployeeModel.js";
import { errorResponse, succesResponse } from "../../../utils/serverResponse.js";

const AdminjobRouter = Router();

// API to get all jobs
AdminjobRouter.get("/getjob", getAllJobsController);
AdminjobRouter.put("/approve-employer", approveOrRejectEmployerController);
AdminjobRouter.get("/pending-employers", getPendingEmployersController);
AdminjobRouter.get("/approved-employers", getapprovedEmployersController);

export default AdminjobRouter;

async function getPendingEmployersController(req, res) {
  try {
    // Filter employers by status: "pending"
    const pendingEmployers = await employeModel.find({ status: "pending" });
    return succesResponse(res, "Pending employers retrieved successfully.", pendingEmployers);
  } catch (error) {
    console.error("Error in getPendingEmployersController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function getapprovedEmployersController(req, res) {
  try {
    // Filter employers by status: "pending"
    const pendingEmployers = await employeModel.find({ status: "approved" });
    return succesResponse(res, "Pending employers retrieved successfully.", pendingEmployers);
  } catch (error) {
    console.error("Error in getPendingEmployersController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function approveOrRejectEmployerController(req, res) {
    try {
      const { id } = req.query; 
      const { status } = req.body; 
  
      // Validate required fields
      if (!id) {
        return errorResponse(res, 400, "Employer ID is required.");
      }
      if (!["approved", "pending"].includes(status)) {
        return errorResponse(
          res,
          400,
          "Status must be either 'approved' or 'pending'."
        );
      }
  
      // Find the employer by ID
      const employer = await employeModel.findById(id);
      if (!employer) {
        return errorResponse(res, 404, "Employer not found.");
      }
  
      // Update the employer's status
      employer.status = status;
      await employer.save();
  
      return succesResponse(
        res,
        `Employer ${status} successfully.`,
        employer
      );
    } catch (error) {
      console.error("Error in approveOrRejectEmployerController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }

// Controller to get all job listings
async function getAllJobsController(req, res) {
  try {
    // Fetch all job listings from the database
    const jobs = await jobModel.find({});

    if (jobs.length === 0) {
      return errorResponse(res, 404, "No job listings found.");
    }

    return succesResponse(
      res,
      "All job listings retrieved successfully.",
      jobs
    );
  } catch (error) {
    console.error("Error in getAllJobsController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}