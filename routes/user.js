const express = require("express")
const router = express.Router()
const User = require("../models/User")
const cryptoJS = require("crypto-js")
const { verfiyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("./verifyToken")

// UPDATE USER
router.put("/update/:id", verfiyTokenAndAuthorization ,async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.CR_SEC).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set : req.body
    },{new:true})
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(500).json(err)
  }
})

// DELETE USER
router.delete("/delate/:id", verfiyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id)
    res.status(200).json("user sucessfuly DELETED")
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER
router.get("/find/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
  const user = await User.findById(req.params.id)
      const {password, ...other} = user._doc
      res.status(200).json(other)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

// GET ALL USER
router.get("/find", verfiyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users =query ? await User.find().sort({_id : -1}).limit(5) : await User.find();
      res.status(200).json(users)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

// GET USER STATS
router.get("/stats", verfiyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month:{$month: "$createdAt"}
        }
      },
      {
        $group: {
          _id: "$month",
          total:{$sum: 1},
        }
      }
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json("this is a error")
  }

})
module.exports = router; 