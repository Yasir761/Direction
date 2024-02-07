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
        index: true
        
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
         index: true   
    },
    password: {
        type: String, // use bcrypt
        required: true,
    },
      // Optional fields with validation
      country: {
        type: String,
        trim: true,
        index: true
      },
      phone: {
        type: String,
        trim: true,
        match: /^[+]\d{2,3}[-\s]?\d{3}[-\s]?\d{4}[-\s]?\d{3,4}$/, // RegEx for valid phone numbers
        index: true
      },


    
},
{timestamps: true}
);




export const User = mongoose.model("User",userSchema);