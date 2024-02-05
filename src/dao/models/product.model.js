const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require:true
    },
    price: {
        type: Number,
        require:true
    },
    thumbnail: {
        type: [String],
    },
    code: {
        type: String,
        require: true,
        unique: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
})

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;