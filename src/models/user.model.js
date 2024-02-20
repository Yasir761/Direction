import mongoose, { Schema } from'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true, 
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true, 
        unique: true,
        index: true
        
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
         index: true   
    },
    password: {
        type: String, // use bcrypt
        required: [true, 'Password is required'],
    },
    refreshToken: {
      type : String,
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


userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullname:this.fullname,
  },
  process.env.ACCESS_TOKEN_SECRET,

  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
};

userSchema.methods.generateRefreshToken = async function(){

  return jwt.sign({
    _id:this._id
  },
  process.env.REFRESH_TOKEN_SECRET,

  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  }
  )
};


export const User = mongoose.model("User",userSchema);