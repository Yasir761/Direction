import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const upload = async (path)=>{

  try{
    if(!path) return null;
    const response = await Cloudinary.uploader.upload(path,{
      resource_type: "auto"
    });
    // file has been uploaded 
    console.log("File is uploaded on cloudinary",
    response.url);
    return response;

  }catch(error){
    fs.unlinkSync(path);  // remove the file from the system

    return null;
  }
}

export {upload};