const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const { verfiyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("./verifyToken")


// CREATE CART
router.post("/create", verfiyToken ,async (req, res) => {
  try {
    const newCart = await new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(200).json({status:"sucess", savedCart})
  } catch(err) {
    res.status(500).json(err)
  }
})


// UPDATE CART
router.put("/update/:id", verfiyTokenAndAuthorization ,async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
      $set : req.body
    },{new:true})
    res.status(200).json(updatedCart)
  }catch(err){
    res.status(500).json(err)
  }
})

// DELETE CART
router.delete("/delete/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete(req.params.id)
    res.status(200).json("Cart sucessfuly DELETED")
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER CART
router.get("/find/:userId", verfiyTokenAndAuthorization, async (req, res) => {
  try {
  const cart = await Cart.findOne({userId:req.params.userId})
      res.status(200).json(cart)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

// GET ALL
router.get("/all", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router; 