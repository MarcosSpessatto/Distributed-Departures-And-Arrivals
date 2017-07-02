// import DatabaseHelper from '../helpers/DatabaseHelper';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import Mongo from '../db/mongo';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class AirportModel {

    constructor() {
        this.mongo = new Mongo().getConnection();
    }

    getAirports() {
        return new Promise((resolve, reject) => {
            getFromCache()
                .then((cachedAiports) => {
                    if (cachedAiports)
                        resolve(cachedAiports);
                    else {
                        getFromDb(this.mongo)
                            .then(resolve)
                            .catch(reject);
                    }
                })
                .catch(reject);

        });

        function getFromCache() {
            return new Promise((resolve, reject) => {
                MemcachedHelper
                    .getKey(MemcachedKeys.airports)
                    .then(resolve)
                    .catch(reject);
            });
        }

        function getFromDb(mongo) {
            const query = {};
            const filter = {'_id': 0};
            return new Promise((resolve, reject) => {
                mongo
                    .collection('airports')
                    .find(query, filter, (err, result) => {
                        saveIntoMemcached(result)
                            .then(resolve)
                            .catch(reject);
                    });
            });
        }

        function saveIntoMemcached(airports) {
            return new Promise((resolve, reject) => {
                MemcachedHelper
                    .getKey(MemcachedKeys.airports)
                    .then((cachedAirports) => {
                        if (cachedAirports) {
                            resolve(airports);
                        } else {
                            MemcachedHelper
                                .setKey(MemcachedKeys.airports, airports)
                                .then(() => resolve(airports))
                                .catch(reject);
                        }
                    });
            });
        }
    }
}
export default AirportModel;