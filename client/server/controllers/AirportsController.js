class AirportsController {

    list(request, response, next) {
        const airports = {
            "airports": [
                {
                    "iata": "POA",
                    "name": "Aeroporto Internacional Salgado Filho",
                    "city": "Porto Alegre",
                    "lat": -30.0277,
                    "long": -51.2287
                },
                {
                    "iata": "FLN",
                    "name": "Aeroporto Internacional Hercilio Luz",
                    "city": "Florianopolis",
                    "lat": -27.6701,
                    "long": -48.546
                }
            ]
        };

        response.json(airports)
    }

}

export default AirportsController;