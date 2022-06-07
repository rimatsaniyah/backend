const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true
        },
        location:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true
        },
        avatar:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
); 

module.exports = mongoose.model("Product", ProductSchema, "Product");