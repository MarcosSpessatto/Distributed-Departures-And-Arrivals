import express from 'express'
import bodyParser from 'body-parser'
import consign from 'consign'
import cors from 'cors'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(__dirname + '/uploads/'));

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
