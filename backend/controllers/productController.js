const Product = require("../models/productsModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");

// create product --> Admin
exports.createProduct= catchAsyncError(async(req,res,next)=>{
    
    // adding the user who created the product
    req.body.user = req.user.id;  // req.user is collected from cookie
        const product = await Product.create(req.body);
        if(!product)
            return res.status(401).send({message:"Product not created"})


        return res.status(201).json({
            message : "Created",
            success:true,
            product
        })

});

// Get product details

exports.getProductDetails = catchAsyncError(async(req,res,next)=>{

   
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler(404,"Product not found"));
    }

    res.status(200).json({
        success:true,
        product
    })
    
});

// Get all products
exports.getAllProducts= catchAsyncError(async(req,res)=>{
    const numOfPages=5;

    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(numOfPages);
    const products = await apiFeature.query;

        res.status(200).json({
        success:true,
        products
        });

});

// Update product --> admin

exports.updateProduct= catchAsyncError(async(req,res,next)=>{
   
        let product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler(404,"Product not found"));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
        
    
});

// delete product --> admin

exports.deleteProduct= catchAsyncError(async(req,res,next)=>{

    
        let product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler(404,"Product not found"));
    }

    const isProductDeleted = await Product.findByIdAndDelete({_id : product._id})
    if(isProductDeleted)
      return  res.status(200).send({"msg":"deleted"})


    return res.status(500).json({
        success:false,
        message:"Unable to delete"
    })
   
    
});