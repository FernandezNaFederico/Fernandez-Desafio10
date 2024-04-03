const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();




dotenv.config({
    path: mode === "production" ? "./.env.prod" : "./.env.dev"
});

const configObj = {
    port: 8080,
    mongo_url: "mongodb+srv://miyafidi:onira873@cluster0.xexxlgf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    GITclientID: process.env.GITclientID,
    GITclientSecret: process.env.GITclientSecret,
    GITcallbackURL: process.env.GITcallbackURL
}

module.exports = configObj;