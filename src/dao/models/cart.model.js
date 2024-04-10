const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"products",
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }
    ]
})

cartSchema.pre("findOne", function (next) {
    this.populate('product.product')
    next()
})

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;