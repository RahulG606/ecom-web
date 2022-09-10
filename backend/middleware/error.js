const Errorhandler = require("../utils/errorHandler")

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server error";

    // wrong mongodb id error
    if(err.name ==="CastError"){
       // console.log("aada");
        message = `Resource not found. Invalid ${err.path}`;
        err = new Errorhandler(400,message);    
    }

    // duplicate key error

    if(err.code===11000){ 
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new Errorhandler(400,message); 
    }

    // jwt error
    

    if(err.name ==="JsonWebTokenError"){
        const message = `Json web token is expired`;
        err = new Errorhandler(400,message);

    }
    res.status(err.statusCode).json(
        {
            success:false,
            message:err.message,
        }
    );
}