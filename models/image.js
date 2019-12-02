const mongoose = require("mongoose")
const {Schema} = require("mongoose")

const Image = new Schema({
    title: String,
    description: String,
    imageURL: String,
    public_id: String
})

module.exports = mongoose.model("Image" , Image)