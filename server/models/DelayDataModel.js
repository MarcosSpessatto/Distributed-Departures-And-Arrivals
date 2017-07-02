import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import Mongo from '../db/mongo';
require('moment-duration-format');
import moment from 'moment';


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
                        let allPromises = mountPromisesWithAggregate(promises, this.mongo, collection, queries);

                        Promise
                            .all(promises)
                            .then((response) => {
                                let arrivalDelayedAvg;
                                let departureDelayedAvg;

                                if (Math.floor(response[4][0].avg) >= 60)
                                    arrivalDelayedAvg = moment.duration(Math.floor(response[4][0].avg), "minutes").format("HH:mm:ss");
                                else
                                    arrivalDelayedAvg = `00:${moment.duration(Math.floor(response[4][0].avg), "minutes").format("HH:mm:ss")}`;

                                if (Math.floor(response[5][0].avg) >= 60)
                                    departureDelayedAvg = moment.duration(Math.floor(response[5][0].avg), "minutes").format("HH:mm:ss");
                                else
                                    departureDelayedAvg = `00:${moment.duration(Math.floor(response[5][0].avg), "minutes").format("HH:mm:ss")}`;
                                const responseToSend = {
                                    "arrivalOnTimeFlights": response[0],
                                    "arrivalDelayedFlights": response[1],
                                    "arrivalDelayedAverageTime": arrivalDelayedAvg,
                                    "departureOnTimeFlights": response[2],
                                    "departureDelayedFlights": response[3],
                                    "departureDelayedAverageTime": departureDelayedAvg
                                };
                                resolve(responseToSend);
                                MemcachedHelper
                                    .setKey(key, responseToSend)
                                    .then(() => {
                                    })
                                    .catch(() => {
                                    });
                            })
                            .catch((err) => reject(err))
                    }
                });
        });

        function toHHmmss(mins) {
            let mins_num = mins;
            let seconds = Math.floor(mins_num * 60).toFixed(2);
            let hours = Math.floor(mins_num / 60);
            let minutes = Math.floor((mins_num - ((hours * 3600)) / 60));

            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ':' + minutes + ':' + seconds;
        }

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

        function mountPromisesWithAggregate(promises, mongo, collection, queries) {
            const arrDelayQuery = [];
            const queryArrDelay = {'$match': queries[1]};
            const groupArrDelay = {'$group': {_id: null, avg: {$avg: "$ArrDelay"}}};
            arrDelayQuery.push(queryArrDelay);
            arrDelayQuery.push(groupArrDelay);
            promises.push(
                new Promise((resolve, reject) => {
                    mongo
                        .collection(collection)
                        .aggregate(arrDelayQuery, (err, result) => {
                            if (err)
                                reject(err)
                            resolve(result);
                        })
                }));

            const depDelayQuery = [];
            const queryDepDelay = {'$match': queries[1]};
            const groupDepDelay = {'$group': {_id: null, avg: {$avg: "$DepDelay"}}};
            depDelayQuery.push(queryDepDelay);
            depDelayQuery.push(groupDepDelay);
            promises.push(
                new Promise((resolve, reject) => {
                    mongo
                        .collection(collection)
                        .aggregate(depDelayQuery, (err, result) => {
                            if (err)
                                reject(err)
                            resolve(result);
                        })
                }));
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