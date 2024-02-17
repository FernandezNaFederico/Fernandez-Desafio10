const express = require("express");
const app = express();
const port = 8080;
const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const socket = require("socket.io");
const messageModel = require("./dao/models/message.model.js");
const { default: mongoose } = require("mongoose");
require("./database.js");

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
});


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));


app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})


const io = new socket.Server(httpServer);


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado!');

    socket.on('messages', async data => {


        await messageModel.create(data);


        const message = await messageModel.find();
        io.sockets.emit('messageLogs', message);


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
