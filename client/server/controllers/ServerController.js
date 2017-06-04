import SocketClientService from '../services/SocketClientService'

class ServerController {

    list(request, response, next) {
        const servers = {
            "servers": [
                {
                    "name": "serverTales",
                    "location": "999.999.999.999:9999",
                    "year": [1999, 2000],
                    "active": true
                },
                {
                    "name": "serverViegas",
                    "location": "999.999.999.999:9999",
                    "year": [2000],
                    "active": false
                }
            ]
        };

        response.json(servers)
    }

    connect(request, response, next) {
        const body = request.body;

        SocketClientService
            .connect(body.host, body.ip)
            .then((connection) => response.status(200).json())
            .catch((err) => next(err));
    }
    disconnect(request, response, next){
        SocketClientService
            .disconnect()
            .then(() => response.status(200).json())
            .catch((err) => next(err))
    }

}

export default ServerController;