import mongoose, {Schema} from'mongoose';

const userProfileSchema = new Schema({
    bio: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        default: "Student",
        enum: ["Student", "Professional"],
        required: true,
    },

    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
        
    },
    socialMedia: {
        type: [{
            type: String,
            required: true,
            enum: ["facebook", "twitter", "instagram", "linkedin", "github"],
        }],
        required: true,
    },
    
},
    {timestamps: true});