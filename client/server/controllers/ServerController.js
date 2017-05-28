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

}

export default ServerController;