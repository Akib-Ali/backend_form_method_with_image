const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    image: String,
    name: String,
    email: String
})
module.exports = mongoose.model("users", userSchema)