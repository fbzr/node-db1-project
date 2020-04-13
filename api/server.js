const express = require("express");

const server = express();

server.use(express.json());

server.use('/api/accounts', require('./routes/accounts'));

server.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'There was an error executing the operation'
    });
});

module.exports = server;
