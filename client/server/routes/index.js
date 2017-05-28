import ServerRoutes from './server';
import AirportRoutes from './airports';
import CarriersRoutes from './carriers';

function index(app){

    ServerRoutes(app);
    AirportRoutes(app);
    CarriersRoutes(app);
}

module.exports = index;