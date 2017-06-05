import SocketClientService from '../services/SocketClientService'

class ServerController {

    connect(request, response, next) {
        const body = request.body;

        SocketClientService
            .connect(body.ip, body.port)
            .then((connection) => response.status(200).json())
            .catch((err) => next(err));
    }

    isConnected(request, response, next){
        if(global.connection){
            response.status(200).json(true);
        }
        response.status(500).json(false);
    }

    disconnect(request, response, next){
        global.connection = {};
        response.status(200).json();
    }

}

export default ServerController;