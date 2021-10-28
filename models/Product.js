const mongoose = require("mongoose")

const ProductSchema =mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique:true
  },
  des: {
    type: String,
    require: true
  },
  categories: {
    type:Array,
        require:true
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    require:true
  },
  stock: {
    type: Boolean,
    default: true
  },
  img: {
    type: String,
    unique:true
  },
},{timestamps: true })

const Product = mongoose.model("Product",ProductSchema)

module.exports = Product;
