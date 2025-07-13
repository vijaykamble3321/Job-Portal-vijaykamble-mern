import { Router } from "express"
import autherRouter from "./authRouter.js";


const publicRouter= Router();
publicRouter.use("/auth",autherRouter)



export default publicRouter;