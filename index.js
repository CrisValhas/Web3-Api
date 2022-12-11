const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//SERVER EXPRESS
    const server = express();
    server.name = 'API';

    const routes = require('./src/routes/routes');
    const errorHandler = require('./src/middleware/errorHandler');

// MIDDLEWARES
    server.use(express.json());
    server.use(morgan('dev'));
    server.use(cors());
    server.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });

// RUTH PATH
    server.use('/', routes);
    server.use(errorHandler);

// SERVER CONNECT
    
    const  PORT  = 3001;
    server.listen(PORT || 3001 , () => {
        console.log(`server-express listening at ${PORT}`);
    });