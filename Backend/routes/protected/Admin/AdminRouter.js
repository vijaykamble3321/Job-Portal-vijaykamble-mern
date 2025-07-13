import { Router } from "express";
import AdminUserRouter from "./AdminUserRouter.js";
import AdminjobRouter from "./AdminjobRouter.js";




const AdminRouter=Router();

//api
AdminRouter.use("/user",AdminUserRouter)
AdminRouter.use("/job",AdminjobRouter)


export default AdminRouter;