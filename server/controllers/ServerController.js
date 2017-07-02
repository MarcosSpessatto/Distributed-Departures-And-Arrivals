import config from '../config.json';
import AirportModel from '../models/AirportModel';
import CarrierModel from '../models/CarrierModel';
import ServerModel from '../models/ServerModel';
import DelayDataModel from '../models/DelayDataModel';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';
import SocketClientService from '../services/SocketClientService';
import MemcachedHelper from '../helpers/MemcachedHelper';

class ServerController {

    static executeCommand(command) {
        return new Promise((resolve, reject) => {
            if (command === 'GETAVAILABLEYEARS')
                ServerController.getYearsOfWholeSystem().then((years) => resolve(years)).catch((err) => reject(err));
            else if (command === 'GETAIRPORTS')
                ServerController.getAirports().then((airports) => resolve(airports)).catch((err) => reject(err));
            else if (command === 'GETCARRIERS')
                ServerController.getCarriers().then((carriers) => resolve(carriers)).catch((err) => reject(err));
            else
                ServerController.getDelayData(command).then((delayResults) => resolve(delayResults)).catch((err) => reject(err));
        })
    }

    static getYearsOfWholeSystem() {
        return new Promise((resolve, reject) => {
            new ServerModel()
                .getYearsOfWholeSystem()
                .then((servers) => resolve(servers))
                .catch((err) => reject(err));
        });
    }

    static getAirports() {
        return new Promise((resolve, reject) => {
            new AirportModel()
                .getAirports()
                .then((airports) => resolve(airports))
                .catch((err) => reject(err));
        });
    }

    static getCarriers() {
        return new Promise((resolve, reject) => {
            new CarrierModel()
                .getCarriers()
                .then((carriers) => resolve(carriers))
                .catch((err) => reject(err));
        });
    }

    static getDelayData(command) {
        return new Promise((resolve, reject) => {
            let parsedData = parseCommand(command);
            if (config.yearData.includes(parsedData.date.Year)) {
                new DelayDataModel()
                    .getDelayedData(parseCommand(command))
                    .then((delayedData) => resolve(delayedData))
                    .catch((err) => reject(err));
            } else {
                new ServerModel()
                    .getServersFromWholeSystem()
                    .then((servers) => findServerWithCorrectData(servers, parsedData.date.Year))
                    .then((server) => {
                        if (!server)
                            reject(new ResponseFactory().makeResponse(ResponseMessages.unavailableServer));
                        if (server.active) {
                            let splitedHost = server.location.split(':');

                            SocketClientService
                                .execute(command, splitedHost[0], splitedHost[1])
                                .then(resolve)
                                .catch((err) => {
                                    MemcachedHelper
                                        .setToFalseServerDown(server)
                                        .then(() => {
                                            reject(new ResponseFactory().makeResponse(ResponseMessages.unavailableServer))
                                        })
                                        .catch(() => {
                                            reject(new ResponseFactory().makeResponse(ResponseMessages.unavailableServer));
                                        })
                                });
                        } else {
                            reject(new ResponseFactory().makeResponse(ResponseMessages.unavailableServer));
                        }
                    })
                    .catch(reject);
            }

            function findServerWithCorrectData(servers, yearSearched) {
                return servers
                    .servers
                    .filter((server) => server.yearData.includes(yearSearched))[0];
            }
        });

        function parseCommand(command) {
            let splitedCommand = command.split(' ');
            splitedCommand = splitedCommand.filter((command) => command !== '');
            const minimumLenghtToSearch = 2;
            let queryObject = {};

            if (splitedCommand.length < minimumLenghtToSearch) {
                throw new ResponseFactory().makeResponse(ResponseMessages.noDataFound);
            }

            queryObject.date = parseDate(splitedCommand[1]);

            if (!queryObject.date) {
                throw new ResponseFactory().makeResponse(ResponseMessages.noDataFound);
            }

            if (isSearchByAirport(splitedCommand.length) || isSearchByAirportAndCarrier(splitedCommand.length)) {
                const lengthOfDateAndAirportQuery = 3;
                queryObject = appendAirportToObjectQuery(queryObject, splitedCommand, lengthOfDateAndAirportQuery);

                if (isSearchByAirportAndCarrier(splitedCommand.length)) {
                    const lengthOfDateAirportAndCarrierQuery = 4;
                    queryObject = appendCarrierToObjectQuery(queryObject, splitedCommand, lengthOfDateAirportAndCarrierQuery);
                }
            }

            return queryObject;

        }

        function isSearchByAirport(length) {
            return length === 3;
        }

        function isSearchByAirportAndCarrier(length) {
            return length === 4;
        }

        function appendAirportToObjectQuery(queryObject, data, lengthOfDateAndAirportQuery) {
            let object = queryObject;
            object.Origin = data[lengthOfDateAndAirportQuery - 1];
            object.Dest = data[lengthOfDateAndAirportQuery - 1];

            return object;
        }

        function appendCarrierToObjectQuery(queryObject, data, lengthOfDateAirportAndCarrierQuery) {
            let object = queryObject;
            object.UniqueCarrier = data[lengthOfDateAirportAndCarrierQuery - 1];

            return object;
        }

        function parseDate(date) {
            let dateObject = {};

            if (isInvalidDate(date)) {
                return null;
            }

            dateObject.Year = parseInt(date.substr(0, 4));

            if (isYearAndMonth(date) || isFullDate(date)) {
                dateObject.Month = date.substr(4, 2);

                if (isFullDate(date))
                    dateObject.DayofMonth = date.substr(6, 2);
            }

            return dateObject;
        }

        function isYear(date) {
            return date.length === 4;
        }

        function isYearAndMonth(date) {
            return date.length === 6;
        }

        function isFullDate(date) {
            return date.length === 8;
        }

        function isInvalidDate(date) {
            return ((!isYear(date) && !isYearAndMonth(date) && !isFullDate(date)) || isNaN(date));
        }
    }
}

export default ServerController;