import CarriersController from '../controllers/CarriersController';

function carriers(app){

    const carriersController = new CarriersController();


    app
        .get('/api/carriers', carriersController.list)
}

module.exports = carriers;