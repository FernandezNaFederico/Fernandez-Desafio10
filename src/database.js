const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://miyafidi:onira873@cluster0.xexxlgf.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("conexion exitosa"))
    .catch(() => console.log("tenemos un error"))