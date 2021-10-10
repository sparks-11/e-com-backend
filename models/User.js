const mongoose = require("mongoose")

const UserSchema =mongoose.Schema({
  name: {
    type: String,
    require:true,
    unique:true
  },
  email: {
    type: String,
    require: true,
    unique:true
  },
  password: {
    type: String,
    require:true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
},{timestamps: true })

const User = mongoose.model("User",UserSchema)

module.exports = User;