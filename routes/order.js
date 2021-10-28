const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const { verfiyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin } = require("./verifyToken")


// CREATE ORDER
router.post("/create", verfiyToken ,async (req, res) => {
  try {
    const newOrder = await new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json({status:"sucess", savedOrder})
  } catch(err) {
    res.status(500).json(err)
  }
})


// UPDATE ORDER
router.put("/update/:id", verfiyTokenAndAdmin ,async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set : req.body
    },{new:true})
    res.status(200).json(updatedOrder)
  }catch(err){
    res.status(500).json(err)
  }
})

// DELETE ORDER
router.delete("/delete/:id", verfiyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id)
    res.status(200).json("Order sucessfuly DELETED")
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER ORDER
router.get("/find/:userId", verfiyTokenAndAuthorization, async (req, res) => {
  try {
  const orders = await Order.find({userId:req.params.userId})
      res.status(200).json(orders)
  } catch (err) {
    res.status(500).json("user is not exists")
  }
})

// GET ALL
router.get("/all", verfiyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET MONTHLY INCOME
router.get("/income",verfiyTokenAndAdmin, async (req, res) => {
  const productId = res.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth }, ...(productId && {
            products:{$elemMatch: {productId}},
      }) } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales:"$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total:{$sum:"$sales"}
        }
      }
    ]);
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
  }

})


module.exports = router; 
