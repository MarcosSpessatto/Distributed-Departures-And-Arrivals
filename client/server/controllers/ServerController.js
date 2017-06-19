import SocketClientService from '../services/SocketClientService'

class ServerController {

    execute(request, response, next) {
        const query = request.body.query;

        SocketClientService
            .execute(query)
            .then((resultQuery) => response.json(resultQuery))
            .catch((err) => next(err));
    }

    connect(request, response, next) {
        const body = request.body;

        SocketClientService
            .connect(body.ip, body.port)
            .then((connection) => response.status(200).json())
            .catch((err) => next(err));
    }

    isConnected(request, response, next) {
        if (Object.keys(global.connection).length !== 0) {
            response.status(200).json(true);
        } else {
            response.status(503).json(false);
        }
    }

    disconnect(request, response, next) {
        global.connection = {};
        response.status(200).json();
    }

}

export default ServerController;