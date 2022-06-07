const Confirmation = require("../models/Confirmation");
const confirmation = require("../models/Confirmation");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) =>{
    const newConfirmation = new Confirmation(req.body);

    try{
        const savedConfirmation = await newConfirmation.save();
        res.status(200).json(savedConfirmation);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async(req, res) =>{
    try{
        const updatedConfirmation = await Confirmation.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new:true });
        res.status(200).json(updatedConfirmation);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) =>{
    try{
        await Confirmation.findByIdAndDelete(req.params.id);
        res.status(200).json("Confirmation deleted!");
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET USER CONFIRMATIONS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) =>{ 
    try{
        const confirmations = await Confirmation.find({userId: req.params.userId});
        res.status(200).json(confirmations); 
    }
    catch(err){
        res.status(500).json(err);
    }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const confirmations = await Confirmation.find();
        res.status(200).json(confirmations);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router 