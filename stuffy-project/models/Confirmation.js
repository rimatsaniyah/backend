const mongoose = require("mongoose");

const ConfirmationSchema = new mongoose.Schema({
        status:{
            type: String,
            default: "pending"
        },
        transactionId:{
            type: String
        },
        takerId:{
            type: String
        },
        note:{
            type: String
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("Confirmation", ConfirmationSchema, "Confirmation");