const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ]
})


const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;