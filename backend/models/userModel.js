const mongoose = require('mongoose');
const validator = require('validator'); // validate email
const  bcrypt = require('bcryptjs'); // password encryption
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[5,"User name is too short"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Invalid email address"]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minLength:[8,"Password should be greater than 8 digits"],
        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        
    },
    role:{
        type:String,
        default:"user",
    },
    //resetPasswordToken:String,
    //resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.getJWTToken = function(){
    
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{

        expiresIn:process.env.JWT_EXPIRE,

    });
}
// userSchema.methods.getResetPasswordToken = function(){

//     // generating token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//     this.resetPasswordExpire = Date.now()+15*60*1000;

//     return resetToken;
// }

userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}



module.exports = mongoose.model("User",userSchema);
