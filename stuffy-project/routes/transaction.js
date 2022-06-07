const Transaction = require("../models/Transaction");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) =>{
    const newTransaction = new Transaction(req.body);

    try{
        const savedTransaction = await newTransaction.save();
        res.status(200).json(savedTransaction);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async(req, res) =>{
    try{
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new:true });
        res.status(200).json(updatedTransaction);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) =>{
    try{
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json("Transaction deleted!");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET USER TRANSANCTIONS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) =>{ 
    try{
        const transactions = await Transaction.find({userId: req.params.userId});
        res.status(200).json(transactions); 
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router 