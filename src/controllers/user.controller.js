import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
const registerUser = asyncHandler( async(req,res)=>{
    // get the data from the request body
    // validate the data
    // check if user already exists : username, email
    // check for images
    // upload them to the cloudinary
    // save the user in the database
    // remove password and refresh token from the response
    // check for user creation
    // return response

     const {fullname, username, email, password, country, phone}= req.body
     console.log("fullname: ",fullname);
     console.log("password: ",password);
     if(
        [fullname, username, email, password, country].some((field)=>
        field?.trim()==="")
     ) {
        throw new ApiError("All fields are required", 400);
     }

     const existedUser = User.findOne({
        $or:[{username},{email}]
     })
     if(existedUser) {
        throw new ApiError("User already exists", 409);
     }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.cover[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400);
    }

    const avatar =  await uploadOnCloudinary(avatarLocalPath);
    const cover =  await uploadOnCloudinary(coverLocalPath);

    if(!avatar){
        throw new ApiError("Avatar could not be uploaded", 500);
    }

  const user = await  User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password,
        phone:phone || "",
        country:country || "",
        avatar:avatar?.url || "",
        cover:cover?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError("User could not be register", 500);
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User registered successfully"));
})


export {registerUser};