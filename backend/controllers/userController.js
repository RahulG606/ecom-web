const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/sendToken");
const sendmail = require("../utils/sendMail");
const { findOneAndUpdate, findByIdAndUpdate } = require("../models/userModel");


exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body; 

    const user = await User.create({name,email,password,
        avatar:{
            public_id:"jui",
            url:"gui",
        },
    });

    return sendToken(user,201,res);


});

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        next(new Errorhandler(400,"Please enter email and password"));
    }

    const user = await User.findOne({email}).select("+password");
    

    if(!user){
        return next(new Errorhandler(401,"Please enter a valid email and password"));
    }

    const isPasswordMatched = user.matchPassword(password);

    if(!isPasswordMatched){
        next(new Errorhandler(401,"Invalid E-mail or password"));
    }

    return sendToken(user,200,res);


});

exports.logoutUser = catchAsyncError(async(req,res,next)=>{

    // send new cookie with null token and current expiry
    res.cookie("token", null,{   
        expires :new Date(Date.now()),
        httpOnly :true
    }).json({
        success:true,
        message:"Logged out successfully"
    
    })

});

// forgot password

// exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
   
//     const user = await User.findOne({email:req.body.email});
//     //console.log(user);

//     if(!user){
//         return next(new Errorhandler(404,"User not found"));
//     }

//     const resetToken = user.getResetPasswordToken();
//     //console.log(resetToken);

//     await user.save({validateBeforeSave : false});
//     //console.log(user);

//     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
//     //console.log(resetPasswordUrl);

//     const message = `Click on the link to reset password: \n\n ${resetPasswordUrl}\n\n If you have already logged in, ignore this
//     link.`;

//     try {

//         await sendmail({
//             email:user.email,
//             subject:`Ecommerce password recovery`,
//             message

//         })

//         res.status(200).json({
//             success:true,
//             message:`Email sent successfully to ${user.email}`
//         })
        
//     } catch (error) {

//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         await user.save({validateBeforeSave:false});

//         next(new Errorhandler(500,error.message));
        
//     }
// })

// reset password

// get user details

exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user =await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});


// update password

exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.user.email}).select("+password");
    
    const isPasswordMatch = await user.matchPassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new Errorhandler(400,"Wrong old password entered"));
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return next(new Errorhandler(400,"Password does not match"));
    }

    user.password = req.body.newPassword;
    await user.save();

    return sendToken(user,200,res);
})

// update logged-in user details

exports.updateUser = catchAsyncError(async(req,res,next)=>{

    const newUserdata = {
        name:req.body.name,
        email:req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
    })

    res.status(200).json({
        success:true
    })


})








