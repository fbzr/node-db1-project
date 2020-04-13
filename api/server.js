const express = require("express");
const db = require('../data/dbConfig');

const server = express();

server.use(express.json());

// Sqlite server
// server.use('/api/accounts', require('./routes/accounts'));

// Postgresql server
server.use('/api/northwind/products', require('./routes/northwind/products'));

server.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'There was an error executing the operation'
    });
});

module.exports = server;
