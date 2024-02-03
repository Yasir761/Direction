import mongoose, {Schema} from'mongoose';

const userProfileSchema = new Schema({
    bio: {

    },
    role:{
        type: String,
        required: true,
        default: "Learner",
        enum: ["Student", "Professional"],
        required: true,
    },

    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
        
    }
},
    {timestamps: true});