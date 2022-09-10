const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler")
const User = require("../models/userModel")

exports.isAuthenticated = catchAsyncErrors( async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler(401,"Please login to access the resource"));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

exports.authorizeRole = (...roles)=>{

    return (req,res,next)=>{
        
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(403,"Role "+req.user.role+" cannot access"));
        }

        next();
    }
}