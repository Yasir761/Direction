import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import  Jwt from "jsonwebtoken";
import { User } from "../models/user.model";
export const verifyJWT = asyncHandler(async (req, _, next) => {  

   try {
    const token =  req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer ", "")
 
     if(!token){
         throw new ApiError("Unauthorized request", 401);
     }
 
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    const user =  await User.findById(decodedToken?._id).select("-password -refreshToken");
     
     if(!user){
 
         throw new ApiError("Invalid Access Token", 401);
     }
     req.user = user;
     next();
   } catch (error) {
        throw new ApiError(error?.message || 
        "Invalid access token" , 401);
   }

   
});

export {verifyJWT};