// import DatabaseHelper from '../helpers/DatabaseHelper';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import Mongo from '../db/mongo';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class DelayDataModel {

    constructor() {
        this.mongo = new Mongo().getConnection();
    }

    getDelayedData(dataToSearch) {
        return new Promise((resolve, reject) => {
            let key = this.mountKeyToSearchOnCache(dataToSearch);

            MemcachedHelper
                .getKey(key)
                .then((cachedResults) => {
                    if (cachedResults)
                        resolve(cachedResults);
                    else {
                        const collection = dataToSearch.date.Year.toString();
                        let queries = mountQueries(dataToSearch);
                        let promises = mountPromises(queries, this.mongo, collection);

                        Promise
                            .all(promises)
                            .then((response) => {
                                const responseToSend = {
                                    "arrivalOnTimeFlights": response[0],
                                    "arrivalDelayedFlights": response[1],
                                    "arrivalDelayedAverageTime": "00:00:12",
                                    "departureOnTimeFlights": response[2],
                                    "departureDelayedFlights": response[3],
                                    "departureDelayedAverageTime": "00:00:12"
                                };

                                MemcachedHelper
                                    .setKey(key, responseToSend)
                                    .then(() => resolve(responseToSend))
                                    .catch(reject);
                            })
                            .catch((err) => reject(err))
                    }
                });
        });

        function mountPromises(queries, mongo, collection) {
            let promises = [];
            for (let query of queries) {
                promises.push(
                    new Promise((resolve, reject) => {
                        mongo
                            .collection(collection)
                            .count(query, (err, result) => {
                                if (err)
                                    reject(err);
                                resolve(result);
                            })
                    }));
            }

            return promises;
        }

        function mountQueries(data) {
            let dataCopy = Object.assign({}, data);
            let query = {};
            delete dataCopy.date.Year;
            if (dataCopy.date.Month)
                query.Month = parseInt(dataCopy.date.Month);
            if (dataCopy.date.DayofMonth)
                query.DayofMonth = parseInt(dataCopy.date.DayofMonth);
            if ((dataCopy.Origin && dataCopy.Origin !== '***') || (dataCopy.Dest && dataCopy.Dest !== '***')) {
                let airports = [];
                if (dataCopy.Origin && dataCopy.Origin !== '***')
                    airports.push({'Origin': dataCopy.Origin});
                if (dataCopy.Dest && dataCopy.Dest !== '***')
                    airports.push({'Dest': dataCopy.Dest});
                query.$or = airports;
            }
            if (dataCopy.UniqueCarrier)
                query.UniqueCarrier = dataCopy.UniqueCarrier;

            query.Cancelled = 0;
            let queries = [];
            queries.push(arrOnTime(query));
            queries.push(arrDelayed(query));
            queries.push(depOnTime(query));
            queries.push(depDelayed(query));

            return queries;
        }

        function arrOnTime(query) {
            let copy = Object.assign({}, query);
            copy.ArrDelay = {'$lte': 0};
            return copy;
        }

        function arrDelayed(query) {
            let copy = Object.assign({}, query);
            copy.ArrDelay = {'$gt': 0};
            return copy;
        }

        function depOnTime(query) {
            let copy = Object.assign({}, query);
            copy.DepDelay = {'$lte': 0};
            return copy;
        }

        function depDelayed(query) {
            let copy = Object.assign({}, query);
            copy.DepDelay = {'$gt': 0};
            return copy;
        }
    }

    mountKeyToSearchOnCache(dataToSearch) {
        let prefix = MemcachedKeys.data;
        let key;

        key = `${prefix}_${dataToSearch.date.Year}`;

        if (hasMonth(dataToSearch))
            key += `${dataToSearch.date.Month}`;
        if (hasDay(dataToSearch))
            key += `${dataToSearch.date.DayofMonth}`;

        if (hasAirport(dataToSearch) && hasCarrier(dataToSearch))
            key += `_${dataToSearch.Origin}_${dataToSearch.UniqueCarrier}`;
        else {
            if (hasCarrier(dataToSearch))
                key += `__${dataToSearch.UniqueCarrier}`;
            if (hasAirport(dataToSearch))
                key += `_${dataToSearch.Origin}`;
        }

        return key;


        function hasAirport(data) {
            return data.Origin && data.Origin !== '***';
        }

        function hasCarrier(data) {
            return data.UniqueCarrier ? true : false;
        }

        function hasMonth(data) {
            return data.date.Month ? true : false;
        }

        function hasDay(data) {
            return data.date.DayofMonth ? true : false;
        }
    }

}
export default DelayDataModel;