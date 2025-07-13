import express from "express";
import path from "path";
import { FRONTEND_PATH, MODE, PORT } from "./serverConfig.js";
import dbConnect from "./db.js";
import publicRouter from "./routes/public/publicRouter.js";
import createSuperAdmin from "./utils/Superadmin.js";
import ProtectedRouter from "./routes/protected/ProtectedRouter.js";
import { authmiddleware } from "./utils/jwtTokens.js";
import UploadRouter from "./routes/public/UploadRouter.js";
import cors from "cors";
import { errorResponse } from "./utils/serverResponse.js";

const app = express();
const port = PORT;
const dir = path.resolve();
// for prod
const frontendpath = path.join(dir, FRONTEND_PATH);
//check the development mode of development
if (MODE === "prod") {
  console.log("running in production mode");
  app.use(express.static(frontendpath));
} else {
  console.log("running in developement mode");
  app.use(cors());
}

app.use(express.json());
app.use("/uploads", express.static("./uploads"));



app.use("/api/public", publicRouter);
app.use("/api/protected", authmiddleware, ProtectedRouter);

//
//for not found
app.use((req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendpath, "index.html"));
    return;
  }
  errorResponse(res, 404, "path not found");
});

try {
  await dbConnect();

  app.listen(port, () => {
    console.log(`started listening at http://localhost:${port}`);
    createSuperAdmin();
  });
} catch (error) {
  console.log("Db error", error);
}
