const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const multer = require("multer")
const path = require("path")
const { verfiyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("./verifyToken")

// STORAGE ENGINE
const storage = multer.diskStorage({
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
// UPLOAD ENGINE
const upload = multer({
  storage: storage,
  limits:{fileSize:1000000 * 3}
})


// CREATE PRODUCT
router.post("/create",verfiyTokenAndAdmin,async (req, res) => {
  try {
    const newProduct = await new Product({
      title:req.body.title,
      des: req.body.description,
      categories: req.body.categories,
      size: req.body.size,
      color: req.body.color,
      price:req.body.price,
      img:"https://github.com/sparks-11/category-imgs/blob/main/category-4.jpg?raw=true",
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({status:"success", savedProduct})
  } catch(err) {
    res.status(500).json(err)
  }
})


// UPDATE PRODUCT
router.put("/update/:id", verfiyTokenAndAdmin ,async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set : req.body
    },{new:true})
    res.status(200).json(updatedProduct)
  }catch(err){
    res.status(500).json(err)
  }
})

// DELETE PRODUCT
router.delete("/delete/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete(req.params.id)
    res.status(200).json("Product sucessfuly DELETED")
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
  const product = await Product.findById(req.params.id)
      res.status(200).json(product)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

// GET ALL PRODUCTS
router.get("/find", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({createdAt: -1}).limit(5)
    } else if(qCategory){
      products = await Product.find({
        categories: {
        $in : [qCategory],
      }})
    } else {
      products = await Product.find()
    }
      res.status(200).json(products)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

module.exports = router; 