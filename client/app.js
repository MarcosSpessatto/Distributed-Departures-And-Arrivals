import express from 'express'
import routes from './server/routes'

const app = express();

app.use(express.static(__dirname + '/public/'));

global.connection = {};

routes(app);

app.get('/*', (req, res) =>  {
    res.sendFile(__dirname + '/public/index.html');
});


//404 error
app.use((request, response, next) => {
    const err = new Error('Not found!');
    err.status = 404;
    next(err);
});

//error handling
app.use((err, request, response, next) => {
    response.status(err.status || 500).json({err: err.message});
});

module.exports = app;
