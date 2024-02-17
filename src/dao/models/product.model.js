const mongoose = require("mongoose");
const Paginate = require("mongoose-paginate-v2");

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

productSchema.plugin(Paginate);

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;