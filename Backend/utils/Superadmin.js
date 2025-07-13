
// import userModel from "../models/Usermodel.js";
import userModel from "../models/userModel.js";
import { hashPassword } from "./encryptPassword.js";
// import bcryptjs from "bcryptjs"




async function createSuperAdmin() {

    const superAdmin= await userModel.findOne({
        email:"admin@gmail.com"
    });
    if (superAdmin)return;

    userModel.create({
         fname:"super",
         lname:"admin",
         email:"0",
         password:hashPassword("admin"),
         role:"admin",
    })
    
}

export default createSuperAdmin;