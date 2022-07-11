const router = require("express").Router();

const stripe = require("stripe")("sk_test_51KsUWoSEKBxN2NqVxfxqPuGpkArZ2OQxhGCeinG2ydlGlMMw1P70c05N1WL7rYWgng79OKFqW6pSY0g0cn9APRQ400eQ7zGpor");



router.post("/payment", async (req,res) => {
    console.log(req.body)
    try{
        const customer = await stripe.customers.create({
            source:req.body.tokenId,
            
        })
        console.log(customer)
        await stripe.paymentIntents.create({
            customer:customer.id,
           amount: req.body.amount,
            currency: "rupee",
            receipt_email:"cpraful968@gmail.com",
            description:"method is working",
            payment_method_types: ['card']
        },(stripeErr,stripeRes) => {
            if(stripeErr){
               console.log(stripeErr)
                res.status(500).json(stripeErr)
            }else{
               res.status(200).json(stripeRes);
            }
        })
           
   
       

    }catch(err){
        console.log(err)
    }
   
    
 
})

module.exports = router