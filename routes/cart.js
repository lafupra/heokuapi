const Cart = require("../models/Cart")
const { verifyTokenAndAuthorization ,verifyToken,verifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();

router.post("/",verifyToken,async(req,res)=>{
    const newcart = new Cart(req.body);

    try{

        const savedcart = await newcart.save()

        res.status(200).json(savedcart)

    }catch(err){
        res.status(500).json(err)
    }
});

//update


router.put("/:id",verifyTokenAndAuthorization, async (req,res) =>{
    try{
        const updatedcart = await Cart.findByIdAndUpdate(req.params.id,
            {
                $set:req.body,
            },{new: true}
            );
            res.status(200).json(updatedcart)
    }catch(err){
        res.status(500).json(err)
    }
})


//delete


router.delete("/:id",verifyTokenAndAuthorization, async(req,res) => {
    try{
        const deletecart = await Cart.findByIdAndDelete(req.params.id)

        res.status(200).json("cart deleted")
    }catch(err){
        
        res.status(500).json(err)

    }
})

router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res) => {
    try{
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all

router.get("/", verifyTokenAndAdmin, async(req,res) => {
    try{

        const cart = await Cart.find()
        res.status(200).json(cart)

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;