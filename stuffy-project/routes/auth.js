const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//REGISTER
router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SECRET
            ).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //successsfully added
    }
    catch (err){
        res.status(500).json(err); //for all error
    }
});

//LOGIN
router.post("/login", async (req,res) => {
try{
    const user = await User.findOne({ username: req.body.username}); //one unique username for one user
    !user && res.status(401).json("Sorry, wrong credentials!"); //if no user

    const hashPassword = CryptoJS.AES.decrypt(
        user.password, 
        process.env.PASS_SECRET
        );
        const OriPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        OriPassword !==req.body.password && res.status(401).json("Sorry, wrong credentials!"); //if password uncorrect

        //for acces JWT
        const accesToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            {expiresIn:"7d"} //after a week we not gonnable use this token and should login again
        );

    const { password, ...others } = user._doc; //others mean to email etc.
    res.status(200).json({...others, accesToken}); //if password correct, thats successfully
}
catch (err){
    res.status(500).json(err);
}
});

module.exports = router 