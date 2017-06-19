import ServerController from '../controllers/ServerController';

function server(app){

    const serverController = new ServerController();

    app
        .post('/api/connect', serverController.connect)
        .post('/api/execute', serverController.execute)
        .post('/api/disconnect', serverController.disconnect)
        .get('/api/alive', serverController.isConnected);
}

module.exports = server;