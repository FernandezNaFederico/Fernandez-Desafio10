const express = require("express");
const app = express();
const port = 8080;
const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set(express.static("./src/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

const ProductManager = require("./controllers/product-manager.js");
const prodManager = new ProductManager("src/models/products.json");


//Importamos y configuramos socket.io
const socket = require("socket.io");
const io = socket(httpServer);

io.on('connection', async (socket) => {
    console.log('Un cliente se conectó!')
    socket.on('msn', (data) => {
        console.log(data)
        io.sockets.emit('msn', data)
    })

    // Ahora el servidor va a enviar productos 
    const allProds = await prodManager.getProducts();
    io.sockets.emit('products', allProds)

    //recibir productos eliminados del cliente

    socket.on('deleteProd', async (id) => {
        await prodManager.deleteProduct(id);
        //Enviamos array prods actualizado
        io.sockets.emit('products', allProds)
    })

    //Recibimos el prod agregado del cliente
    socket.on('addProd', async (prod) => {
        await prodManager.addProduct(prod)
        //Enviamos array prods actualizado 
        io.sockets.emit('products', allProds)
    })
})

/*
app.get("/", (req, res) => {
    res.render("index");
});*/


/*
app.get('/', (req, res) => {
    res.send("Bienvenidos a mi primera experiencia con EXPRESS")
});*/
