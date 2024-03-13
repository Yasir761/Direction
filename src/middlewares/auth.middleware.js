import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

/**
 * Middleware to verify JWT access token. 
 * 
 * Tries to get token from request cookies or headers.
 * Verifies token using jwt.verify() with secret.
 * Finds user by decoded token ID.
 * Adds user to request object.
 * Calls next() if valid user found.
 * Throws ApiError with 401 status if invalid.
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies ?.accessToken || req.header("Authorization") ?.replace("Bearer ", "")
    console.log(req.cookies);
    console.log(req.header("Authorization"));
    


    console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedToken);

    const user = await User.findById(decodedToken ?._id).select("-password -refreshToken")
    console.log(user);
        if (!user) {

      throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error ?.message || "Invalid access token")
  }

  console.log("verifyJWT");
})