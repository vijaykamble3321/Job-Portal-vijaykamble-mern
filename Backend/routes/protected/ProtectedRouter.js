import { Router } from "express";
import EmployeRouter from "./Employer/EmployeRouter.js";
import AdminRouter from "./Admin/AdminRouter.js";
import { isSuperAdminMiddleware } from "../../utils/jwtTokens.js";
import UserRouter from "./Users/UserRouter.js";



const ProtectedRouter=Router();

//api
ProtectedRouter.use("/employe",EmployeRouter)
ProtectedRouter.use("/admin",isSuperAdminMiddleware,AdminRouter)
ProtectedRouter.use("/users",UserRouter)


export default ProtectedRouter;