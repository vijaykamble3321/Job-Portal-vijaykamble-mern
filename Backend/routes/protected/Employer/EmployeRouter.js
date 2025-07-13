import { Router } from "express";
import EmployeJobRouter from "./EmployeJobRouter.js";
import EmployeUserRouter from "./EmployeUserRouter.js";



const EmployeRouter=Router();

//api
EmployeRouter.use("/job",EmployeJobRouter)
EmployeRouter.use("/user",EmployeUserRouter)


export default EmployeRouter;