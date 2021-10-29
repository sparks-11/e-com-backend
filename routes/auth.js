const express = require("express")
const router = express.Router()
const User = require("../models/User")
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")


// REGISTER USER
router.post("/register", async (req,res) => {
  try {
    const newPassword = await cryptoJS.AES.encrypt(req.body.password, process.env.CR_SEC).toString()
    const savedUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      mobile: req.body.mobile,
      img: req.body.img,
      dob: req.body.dob,
      address:req.body.address,
      password:newPassword
    })
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(501).json({error: "this email already exsits"})
  }
})

// LOGIN USER
router.post("/login",async (req, res)=> {
  try {
    const user = await User.findOne({
    email:req.body.email
    })
    if (!user) {
      return res.status(501).json({error: "no user found"})
    }
    const hashedPassword = cryptoJS.AES.decrypt(user.password, process.env.CR_SEC)
    const OriginalPassword = hashedPassword.toString(cryptoJS.enc.Utf8)
    if (OriginalPassword === req.body.password) {
      const token =  jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
      },process.env.JWT_SEC,
      { expiresIn: "3d" }
      )
      const {password, ...other} = user._doc
      res.status(200).json({...other,token})
    } else {
      res.json({status:'bad',error:"invalid password"})
    }
  }catch(err){
    res.status(500).json({error: err})
  }
})

module.exports = router;
