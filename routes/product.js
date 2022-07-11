const router = require("express").Router();
const {verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken")
const Product = require("../models/Product")
const CryptoJS = require("crypto-js");


//add products//


router.post("/",verifyTokenAndAdmin, async(req,res) => {
            
    const newProduct = new Product(req.body);


    try{

          const savedProduct = await newProduct.save();

          res.status(200).json(savedProduct)

    }catch(err){
        res.status(500).json(err)
    }

})


//update

router.put("/:id", verifyTokenAndAdmin, async(req,res) => {
    

 
try{
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
    {new:true}
    );
    res.status(200).json(updatedProduct);
}catch(err){
res.status(500).json(err);
}
});


//delete//


router.delete("/:id",verifyTokenAndAuthorization,async(req,res) => {
    try{
       await Product.findByIdAndDelete(req.params.id);
       res.status(200).json("Product has been deleted...")
    }catch(err){
        res.status(500).json(err)
    }
})


//get products//


router.get("/find/:id",async (req,res) => {
    try{
       const product = await Product.findById(req.params.id);

     
       res.status(200).json(product);

    }catch(err){
        res.status(500).json(err)
    }
})


//get all product//


router.get("/",async (req,res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;
  
    try{

        let products

      if(qNew){
          products = await Product.find().sort({createdAt:-1}).limit(5);
         
      }else if(qCategory){
          
          products = await Product.find({
              categories:{
                  $in: [qCategory]
              },
          });
          
          
      }else{
          products = await Product.find();
         
      }

      
        
       res.status(200).json(products);

    }catch(err){
        res.status(500).json(err)
    }
})


//get product status//

router.get("/stats",verifyTokenAndAdmin,async(req,res) => {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));

    try{
      
      const data = await Product.aggregate([
          {$match:{createdAt:{$gte : lastyear}}},


          {
              $project:{
                   month: {$month :"$createdAt"},
              }
          },

          {
              $group :{
                  _id:"$month",
                  total:{$sum:1}
              }
          }


      ]);

      res.status(200).json(data);

    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;