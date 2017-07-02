import express from 'express'
import bodyParser from 'body-parser'
import consign from 'consign'
import cors from 'cors'
import SocketServerService from './services/SocketServerService'
import MemcachedHelper from './helpers/MemcachedHelper'
// import DatabaseHelper from './helpers/DatabaseHelper'

const app = express();

app.use(bodyParser.json());
app.use(cors());

SocketServerService.listen();
MemcachedHelper.init();
// DatabaseHelper.init();

//Load all modules
consign({verbose: false})
    .include('db')
    .then('helpers')
    .then('services')
    .then('models')
    .then('controllers')
    .then('routes')
    .into(app);


//404 error
app.use((request, response, next) => {
    let err = new Error('Not found!');
    err.status = 404;
    next(err);
});

//error handling
app.use((err, request, response, next) => {
    response.status(err.status || 500).json({err: err.message});
});

module.exports = app;
