const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Profile"
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Course"
        }
    ],
    img:{
        type:String,
        required:true,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress"
        }
    ],
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type : Date
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    // Add timestamps for when the document is created and last modified
} ,    {timestamps:true}    );

module.exports = mongoose.model("User",userSchema);