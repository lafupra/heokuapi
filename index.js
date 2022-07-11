const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const cors = require("cors")
const stripeRoute = require("./routes/stripe")


dotenv.config();

app.use(cors())

app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("db connection successfull")).catch(() => console.log("not working"))


app.get("/",(req,res) => {
    res.send("it's working")
})


app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/cart",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/checkout",stripeRoute)

app.listen(process.env.PORT || 4000,() => {
    console.log("backend server is running")
})