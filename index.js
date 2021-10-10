const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const dotenv = require("dotenv")

dotenv.config()
const app = express()


//db connection 
const DB_Connect = async (req,res) => {
  try {
    const touch = await mongoose.connect(process.env.DB_URL)
    if(touch) console.log("the database is connected")
  } catch (err) {
    res.status(500).json(err)
  }
}

// static
app.use("/product",express.static("uploads/images"))


app.use(express.json())
app.use(cors())

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)



const PORT =process.env.PORT || 1337

app.listen(PORT , () => {
  console.log(`the server is started ${PORT}`)
  DB_Connect()
})