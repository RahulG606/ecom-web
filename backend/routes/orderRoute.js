const express = require("express");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
// const { isAuthenticated } = require("../middleware/auth");
const {newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder} = require("../controllers/orderController"); 

const router = express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);
router.route("/order/:id").get(isAuthenticated,authorizeRole("admin") ,getSingleOrder);
router.route("/orders/me").get(isAuthenticated,myOrders);
router.route("/admin/orders").get(isAuthenticated,authorizeRole("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticated,authorizeRole("admin"),updateOrder)
.delete(isAuthenticated,authorizeRole("admin"),deleteOrder);

module.exports = router;

