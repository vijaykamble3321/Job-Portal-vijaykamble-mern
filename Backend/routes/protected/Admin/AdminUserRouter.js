import { Router } from "express";
import {
  errorResponse,
  succesResponse,
  
} from "../../../utils/serverResponse.js";
import userModel from "../../../models/userModel.js";

const AdminUserRouter = Router();

// ------------------ Existing Routes ------------------ //
AdminUserRouter.get("/user-all", getAllUsersController);
AdminUserRouter.get("/employe-all", getAllEmployersController);
AdminUserRouter.get("/user-employer-count", getUserEmployerCountController);

// ------------------ New Routes ------------------ //
AdminUserRouter.put("/update/:id", updateUsersController); 
AdminUserRouter.delete("/delete/:id", deleteUserController); 

export default AdminUserRouter;

// ------------------ Controllers ------------------ //

async function getAllUsersController(req, res) {
  try {
    const users = await userModel.find({ role: "user" }, { password: 0 });

    if (users.length === 0) {
      return errorResponse(res, 404, "No users found.");
    }

    return succesResponse(res, "All users retrieved successfully.", users);
  } catch (error) {
    console.error("Error in getAllUsersController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function getAllEmployersController(req, res) {
  try {
    const employers = await userModel.find(
      { role: "employer" },
      { password: 0 }
    );

    if (employers.length === 0) {
      return errorResponse(res, 404, "No employers found.");
    }

    return succesResponse(
      res,
      "All employers retrieved successfully.",
      employers
    );
  } catch (error) {
    console.error("Error in getAllEmployersController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function getUserEmployerCountController(req, res) {
  try {
    const userCount = await userModel.countDocuments({ role: "user" });
    const employerCount = await userModel.countDocuments({ role: "employer" });

    return succesResponse(
      res,
      "User and employer counts retrieved successfully.",
      {
        userCount,
        employerCount,
      }
    );
  } catch (error) {
    console.error("Error in getUserEmployerCountController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// ------------------ Update User ------------------ //
async function updateUsersController(req, res) {
    try {
      const { id } = req.params; // ✅ Extract 'id' from URL params
      const updateData = req.body;
  
      if (!id) {
        return errorResponse(res, 400, "User ID is not provided.");
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updatedUser) {
        return errorResponse(res, 404, "User not found.");
      }
  
      return succesResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
      console.error("updateUsersController", error);
      return errorResponse(res, 500, "Internal server error");
    }
  }
  
// ------------------ Delete User ------------------ //
async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return errorResponse(res, 400, "User ID is required");
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse(res, 404, "User not found");
    }

    return succesResponse(res, "User deleted successfully", deletedUser);
  } catch (error) {
    console.error("__deleteUserController__", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
