import mongoose, { Schema } from'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true, 
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true, 
        unique: true,
        
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
         index: true   
    },
    password: {
        type: String, // use encrypt
        required: true,
    }

    
},
{timestamps: true}
);




export const User = mongoose.model("User",userSchema);