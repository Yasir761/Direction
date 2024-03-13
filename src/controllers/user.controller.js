import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError("User not found", 404);
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken, refreshToken};
    
    }catch(error){
        throw new ApiError("Something went wrong while generating refresh tokens", 500);
    }
}
const registerUser = asyncHandler( async(req,res)=>{

     const {fullname, username, email, password}= req.body
     console.log("fullname: ",fullname);
     console.log("password: ",password);
     console.log("email: ",email);
     console.log("username: ",username);
     if(
        [fullname, username, email, password].some((field)=>
        field?.trim() === "")
     ) {
        throw new ApiError("All fields are required", 400);
     }

     const existedUser = await User.findOne({
        $or:[{username},{email}]
     })
     if(existedUser) {
        throw new ApiError("User already exists", 409);
     }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverLocalPath = req.files?.cover[0]?.path;
     let coverLocalPath;
     if(req.files && Array.isArray(req.files.cover)&& req.files.cover.length > 0){
        coverLocalPath = req.files.cover[0].path; 
     }
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
        avatar:avatar.url,
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
 
const loginUser = asyncHandler( async(req,res)=>{       
    
    const {email, username, password} = req.body;

    if(!username && !email){
        throw new ApiError("Email or username is required", 400);
    }
    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError("User does not exist", 404);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError("Invalid password", 401);
    }

    const {accessToken,refreshToken} =
    await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
        200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler( async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))

})

export {
    registerUser,
    loginUser,
    logoutUser            
};