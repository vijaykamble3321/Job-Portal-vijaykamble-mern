import { Router } from "express";
import { errorResponse, succesResponse } from "../../../utils/serverResponse.js";
import jobModel from "../../../models/JobModel.js";
import employeModel from "../../../models/EmployeeModel.js";



const EmployeJobRouter=Router();

//api
EmployeJobRouter.post("/createjob",createJobController)
EmployeJobRouter.put("/createjob-update",updateJobController)
EmployeJobRouter.delete("/createjob-delete",deleteJobController)
//
EmployeJobRouter.post("/register",registerEmployerController)
EmployeJobRouter.get("/register-check",checkEmployerStatusController)
EmployeJobRouter.get("/jobsall", getEmployerJobsController); 
 

export default EmployeJobRouter;


async function getEmployerJobsController(req, res) {
  try {
    const employerId = res.locals.userId;
    
    if (!employerId) {
      return errorResponse(res, 401, "Unauthorized: User ID missing.");
    }

    const jobs = await jobModel.find({ employerId }).sort({ createdAt: -1 });
    
    return succesResponse(res, "Jobs retrieved successfully.", jobs);
  } catch (error) {
    console.error("Error in getEmployerJobsController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}


async function registerEmployerController(req, res) {
    try {
      const { employerName, legalName, sector, category, contactPerson, address } = req.body;
      const userId = res.locals.userId;

      if (!userId) {
        return errorResponse(res, 401, "Unauthorized: User ID missing.");
      }
     
      if (!employerName || !legalName || !category || !address) {
        return errorResponse(res, 400, "All fields are required.");
      }
  
      const newEmployer = await employeModel.create({
        employerName,
        legalName,
        sector,
        category,
        contactPerson,
        address,
        userId,

      });
  
      return succesResponse(res, "Employer registered successfully.", newEmployer);
    } catch (error) {
      console.error("Error in registerEmployerController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }
  
  // Controller for employer to check their approval status
  async function checkEmployerStatusController(req, res) {
    try {
      const employerId = res.locals.userId;
      console.log("userid", employerId);
  
      // Find the employer by ID
      const employer = await employeModel.findOne({ userId: employerId });
      if (!employer) {
        return errorResponse(res, 404, "Employer not found.");
      }
  
      return succesResponse(
        res,
        "Employer status retrieved successfully.",
        employer
      );
    } catch (error) {
      console.error("Error in checkEmployerStatusController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }
  
  async function createJobController(req, res) {
    try {
      if (!res.locals.email || !res.locals.role) {
        return errorResponse(res, 401, "Unauthorized: Missing email or role");
      }
  
      // Extract employerId from authentication middleware
      const employerId = res.locals.userId;
  
      // Validate required fields
      const { title, description, salary, category, location, experience } = req.body;
      if (!title || !description || !salary || !category || !location || !experience) {
        return errorResponse(res, 400, "All fields are required.");
      }
  
      // Check if employer exists and is approved
      const employer = await employeModel.findOne({ userId: employerId }); 
      console.log("create job ", employer);
  
      if (!employer || employer.status !== "approved") {
        return errorResponse(res, 403, "Employer is not approved to post jobs");
      }
  
      // Create job
      const newJob = await jobModel.create({
        title,
        description,
        salary,
        category,
        location,
        experience,
        employerId: res.locals.userId,  
      });
  
      return succesResponse(res, "Job created successfully.", newJob);
    } catch (error) {
      console.error("Error in createJobController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }
  
  async function updateJobController(req, res) {
    try {
      const { id } = req.query; // Get job ID from query parameter
      const { title, description, salary, category, location, experience } = req.body;
  
      // Validate required fields
      if (!title || !description || !salary || !category || !location || !experience) {
        return errorResponse(res, 400, "All fields are required.");
      }
  
      // Check if ID is provided and trim it
      if (!id) {
        return errorResponse(res, 400, "Job ID is required.");
      }
      const trimmedId = id.trim(); // Trim the ID to remove extra spaces
  
      // Find the job by ID
      const job = await jobModel.findById(trimmedId);
      if (!job) {
        return errorResponse(res, 404, "Job not found.");
      }
  
      // Check if the authenticated employer owns the job
      if (job.employerId.toString() !== res.locals.userId) {
        return errorResponse(res, 403, "Forbidden: You are not authorized to update this job.");
      }
  
      // Update the job details using findByIdAndUpdate
      const updatedJob = await jobModel.findByIdAndUpdate(
        trimmedId,
        {
          title,
          description,
          salary,
          category,
          location,
          experience,
        },
        { new: true } 
      );
  
      return succesResponse(res, "Job updated successfully.", updatedJob);
    } catch (error) {
      console.error("Error in updateJobController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }
  
  // Controller to delete a job
  async function deleteJobController(req, res) {
    try {
      const { id } = req.query; 
      if (!id) {
        return errorResponse(res, 400, "Job ID is required.");
      }
      const trimmedId = id.trim(); 
      const job = await jobModel.findById(trimmedId);
      if (!job) {
        return errorResponse(res, 404, "Job not found.");
      }
      if (job.employerId.toString() !== res.locals.userId) {
        return errorResponse(res, 403, "Forbidden: You are not authorized to delete this job.");
      }
      await jobModel.findByIdAndDelete(trimmedId);
  
      return succesResponse(res, "Job deleted successfully.");
    } catch (error) {
      console.error("Error in deleteJobController:", error);
      return errorResponse(res, 500, "Internal server error.");
    }
  }