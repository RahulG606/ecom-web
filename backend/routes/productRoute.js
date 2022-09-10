const express = require("express");
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails} = require("../controllers/productController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");


const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticated, authorizeRole("admin") ,createProduct);
router.route("/admin/product/:id").put(isAuthenticated, authorizeRole("admin") ,updateProduct)
.delete(isAuthenticated, authorizeRole("admin") ,deleteProduct);

router.route("/product/:id").get(getProductDetails);

module.exports= router