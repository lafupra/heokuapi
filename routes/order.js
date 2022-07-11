const router = require("express").Router();
const Order = require("../models/Order");
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");


router.post("/",verifyToken,async(req,res)=>{
    const neworder = new Order(req.body);

    try{

        const savedorder = await neworder.save()

        res.status(200).json(savedorder)

    }catch(err){
        res.status(500).json(err)
    }
});

//update


router.put("/:id",verifyTokenAndAdmin, async (req,res) =>{
    try{
        const updatedorder = await Order.findByIdAndUpdate(req.params.id,
            {
                $set:req.body,
            },{new: true}
            );
            res.status(200).json(updatedorder)
    }catch(err){
        res.status(500).json(err)
    }
})


//delete


router.delete("/:id",verifyTokenAndAdmin, async(req,res) => {
    try{
        const deleteorder = await Order.findByIdAndDelete(req.params.id)

        res.status(200).json("order deleted")
    }catch(err){
        
        res.status(500).json(err)

    }
})

//get user orders

router.get("/find/:userId", verifyTokenAndAuthorization, async(req,res) => {
    try{
        const orders = await Order.find({userId: req.params.userId})
        res.status(200).json(orders)
    }catch(err){
       res.status(500).json(err)
    }
})

//get all

router.get("/", verifyTokenAndAdmin, async(req,res) => {
    try{

        const orders = await Order.find()
       res.status(200).json(orders)

    }catch(err){
        res.status(500).json(err)
    }

})


//get monthly income 

router.get("/income", verifyTokenAndAdmin, async(req,res) =>{


    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try{

        const income = await Order.aggregate([
            {$match : {
                createdAt : {
                   $gte:previousMonth
                },
                ...(productId && {
                    products:{$elemMatch:{productId:productId}},
                })
            }},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total :{$sum : "$sales"}
                }
            }
                
                             
            
        ]);
         
        res.status(200).json(income)
       

    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;