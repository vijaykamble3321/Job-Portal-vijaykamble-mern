import { Router } from "express";
import { errorResponse, succesResponse } from "../../utils/serverResponse.js";
import userModel from "../../models/userModel.js";
import { comparePassword, hashPassword } from "../../utils/encryptPassword.js";
import { generateToken } from "../../utils/jwtTokens.js";

const autherRouter = Router();

//api

autherRouter.post("/signup", signupController);
autherRouter.post("/signin", signinController);
autherRouter.post("/refresh", refreshTokenController);
autherRouter.post("/forgot",forgotPasswordController)
autherRouter.post("/reset",resetPasswordController)

export default autherRouter;

async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "email and password are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "user not found");
    }
    const randomNum = Math.round(Math.random() * 100000);
    const forgototp = randomNum < 1000000 ? randomNum + 100000 : randomNum;

    await userModel.findOneAndUpdate({ email }, { forgototp });
    //fuction to email otp to user email -

    //
    return succesResponse(res, "otp generate successful.", { otp: forgototp });
  } catch (error) {
    console.log("error during signin", error);
    errorResponse(res, 500, "internal server error");
  }
}
//reset

async function resetPasswordController(req, res) {
  try {
    const { email, otp, password } = req.body;

    if (!email) {
      return errorResponse(res, 400, "email and password are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "user not found");
    }

    if (user.forgototp !== Number.otp) {
      return errorResponse(res, 400, "invalid otp");
    }

    await userModel.findOneAndUpdate(
      { email },
      { password: hashPassword(password) }
    );

    return succesResponse(res, "password reset successful");
  } catch (error) {
    console.log("error during signin", error);
    errorResponse(res, 500, "internal server error");
  }
}

async function refreshTokenController(req, res) {
  try {
    const { refreshtoken } = req.body;
    if (!refreshtoken) {
      return errorResponse(res, "refresh token not provided");
    }
    let payload = null;
    try {
      payload = verifyToken(refreshtoken);
    } catch (error) {
      errorResponse(res, 400, "invalid refreshtoken");
    }
    const tokens = generateToken({
      email: payload.email,
      role: payload.role,
    });

    return succesResponse(res, "signin sucessfull", tokens);
  } catch (error) {}
}
//signup
async function signupController(req, res) {
  try {
    const { fname, lname, email, password, mobile,role } = req.body;
    if (!fname || !lname || !email || !password || !mobile||!role) {
      return errorResponse(res, 404, "all fields are requird");
    }
    await userModel.create({
      fname,
      lname,
      email,
      password:hashPassword(password),
      mobile,
      role,
    });
    succesResponse(res, "signUp-Successful");
  } catch (error) {
    console.log(error);

    errorResponse(res,400, "internal server Error");
  }
}
async function signinController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "email and password are required");
    }
    const user = await userModel.findOne({ email });
    let role = user ? user.role : null;
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }
    const passwordvalid = comparePassword(password, user.password);
    if (!passwordvalid) {
      return errorResponse(res, 401, "invalid password");
    }
    const { accessToken, refreshToken } = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });
    // console.log("Generated roles:", email, role);
    const redirectPath = `/${role}`;
    return succesResponse(res, "signin successfull", {
      accessToken,
      refreshToken,
      redirectPath,
    });
  } catch (error) {
    console.log("error during signin", error);
    return errorResponse(res, 500, "internal server error");
  }
}

