import ServerController from '../controllers/ServerController';

function server(app){

    const serverController = new ServerController();


    app
        .get('/api/server', serverController.list)
        .post('/api/connect', serverController.connect)
}

module.exports = server;