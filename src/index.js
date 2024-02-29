const express = require("express");
const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const cookieParser = require('cookie-parser');
const socket = require("socket.io");
const messageModel = require("./dao/models/message.model.js");
require("./database.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/user.router.js");
const sessionRoutes = require("./routes/session.router.js");
const app = express();
const port = 8080;


//Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        renderPartial: function (header, context) {
            return hbs.handlebars.partials[header](context);
        }
    }
});


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://miyafidi:onira873@cluster0.xexxlgf.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 100
    }),
}))


app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
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
