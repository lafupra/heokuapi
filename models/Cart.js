const mongoose = require("mongoose");



const CartSchema = new mongoose.Schema(
{   
    
    
 userid : {
            type:String,
            required:true,
            unique:false
        },

    cartqauntity:{
        type:Number
    },
 products:
       [ 
        {
            productid :{
                type:String,
            },
            price:{
                type:Number
            },
            color:{
                type:String

            },
            size:{
                type:String
            },
            qauntity:{
                type:Number,
                default:1,
            }
    
         },
         
       ],
       total:{
        type:Number
       },
     


              
},

    {
        timestamps:true
    }

);


module.exports = mongoose.model("Cart",CartSchema);