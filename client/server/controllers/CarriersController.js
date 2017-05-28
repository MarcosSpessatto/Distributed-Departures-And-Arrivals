class CarriersController {

    list(request, response, next) {
        const carriers = {
            "carriers": [
                {
                    "code": "AA",
                    "name": "American Airlines"
                },
                {
                    "code": "AR",
                    "name": "Aerolineas Argentinas"
                }
            ]
        };

        response.json(carriers)
    }

}

export default CarriersController;