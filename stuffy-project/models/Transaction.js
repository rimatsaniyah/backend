const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
    {
        productId:{
            type: String
        },
        status:{
            type: String,
            default: "pending"
        },
        confirmationId:{
            type: Array
        },
        sharerId:{
            type: String
        }
    },
    { timestamps: true }
); 

module.exports = mongoose.model("Transaction", TransactionSchema, "Transaction");