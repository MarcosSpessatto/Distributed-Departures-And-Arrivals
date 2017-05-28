import AirportsController from '../controllers/AirportsController';

function airports(app){

    const airportsController = new AirportsController();


    app
        .get('/api/airports', airportsController.list)
}

module.exports = airports;