import { connect } from "mongoose";
import { DB_URL } from "./serverConfig.js";

async function dbConnect() {
  try {
    await connect(DB_URL),
      {
        timeoutMS: 1000000,
      };
    console.log("DBConnected successful");
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
