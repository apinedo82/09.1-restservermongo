require('dotenv').config();
const Server = require('./models/server');
const mongoose = require('mongoose');



const server = new Server();

server.listen();