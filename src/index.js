const express = require("express");
//const multer = require('multer');
const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const cookieParser = require('cookie-parser');
const socket = require("socket.io");
const messageModel = require("./models/message.model.js");
require("./database.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/user.router.js");
const sessionRoutes = require("./routes/session.router.js");
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
const app = express();
//const port = 8080;

// importacion dotenv.config
const configObj = require('./config/dotenv.config.js');
const { port, mongo_url } = configObj;


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
        mongoUrl: mongo_url,
        ttl: 100
    }),
}))



//app.use(multer({ storage }).single('image'));


app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/", viewsRouter);

// Passport configuracion
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


const httpServer = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

// Websocket

const SocketManager = require('./socket/SocketManager.js');
new SocketManager(httpServer);

/*const io = new socket.Server(httpServer);


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado!');

    socket.on('messages', async data => {


        await messageModel.create(data);


        const message = await messageModel.find();
        io.sockets.emit('messageLogs', message);


    })
})*/