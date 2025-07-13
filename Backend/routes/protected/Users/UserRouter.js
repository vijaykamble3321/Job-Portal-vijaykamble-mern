import { Router } from "express";
import UserjobRouter from "./UserjobRouter.js";



const UserRouter=Router();

//api
UserRouter.use("/job",UserjobRouter)


export default UserRouter;