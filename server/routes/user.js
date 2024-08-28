// Import the required modules
const express = require("express")
const router = express.Router()

//importing middlewares
const { auth  } = require("../middlewares/auth");

//importing controllers

const { login ,signUp , sendOTP , changePassword } = require("../controllers/Auth");
const { resetPassword , resetPasswordToken } = require("../controllers/resetPassword");





//---------------------------------------------------------routes---------------------------------------------

//--------------------------------------------------authentication routes------------------------------
// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.put("/changepassword", auth, changePassword)
//-----------------------------------------------------------------------------------------------------------------




//-----------------------------------------------------password routes------------------------------------
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)
//-----------------------------------------------------------------------------------------------------------------

module.exports = router;