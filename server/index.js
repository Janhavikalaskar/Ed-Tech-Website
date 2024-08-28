const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/payment");
const courseRoutes = require("./routes/course");
const contactUsRoute = require("./routes/Contact");
require("dotenv").config();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 4000;


//database connection
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))
//frontend connection
app.use( cors({origin: "*" , credentials:true}));

//cloudinary connection
cloudinary.clodudinaryConnect();
console.log("cloudinary connected")

//routes mounting
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/reach", contactUsRoute);

//default route
app.get("/",(req , res)=>{
    return res.json({
        success:true,
        message:"server is running"
    })
});

app.listen(PORT,()=>{
    console.log("app is running fine")
})

