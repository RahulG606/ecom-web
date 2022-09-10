const Order = require("../models/orderModel")
const Product = require("../models/productsModel");
const Errorhandler = require('../utils/errorHandler');
const catchAsyncError = require("../middleware/catchAsyncErrors"); 



exports.newOrder = catchAsyncError(async(req,res,next)=>{

    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    })
    res.status(201).json({
        success:true,
        order
    });

});

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        next(new Errorhandler(404,"Order not found with current id."));
    }

    res.status(200).json({
        success:true,
        order
    });

});

// get all orders of log-in users

exports.myOrders = catchAsyncError(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders, 
    });

});

// get all users -> admin

exports.getAllOrders = catchAsyncError(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount=0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders, 
    });

});

// update order status

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    //console.log(req.params.id);
    const orders = await Order.findById(req.params.id);
    //console.log(orders);

    if(!orders){
        next(new Errorhandler(404,"Order not found with current id."));
    }

    if(orders.orderStatus ==="Delivered"){
        return next(new Errorhandler(400,"Product is alreadry delivered"));
    }

    // always call await inside for loop with async parameter 
    orders.orderItems.forEach(async o=>{

        await updateStock(o.product,o.quantity);
    })

    orders.orderStatus = req.body.status;


    if(req.body.status==="Delivered"){
        orders.deliveredAt = Date.now();
    }

    await orders.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    })
})
// check
async function updateStock(id,quantity){
    const product = Order.findById(id);
    console.log(product);

    product.quantity-=quantity;
    product.save({validateBeforeSave:false});
}

 // delete order

exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        next(new Errorhandler(404,"Order not found with current id."));
    }

    await order.remove();


})











