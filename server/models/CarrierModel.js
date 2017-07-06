// import DatabaseHelper from '../helpers/DatabaseHelper';
import Mongo from '../db/mongo';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class AirportModel {

    constructor() {
        this.mongo = new Mongo().getConnection();
    }

    getCarriers() {
        return new Promise((resolve, reject) => {

            getFromCache()
                .then((cachedCarriers) => {
                    if (cachedCarriers)
                        resolve(cachedCarriers);
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
                    .getKey(MemcachedKeys.carriers)
                    .then(resolve)
                    .catch(reject);
            });
        }

        function getFromDb(mongo) {
            const query = {};
            const filter = {'_id': 0};
            return new Promise((resolve, reject) => {
                mongo
                    .collection('carriers')
                    .find(query, filter, (err, result) => {
                        let parsedResult = parseResult(result);
                        saveIntoMemcached(parsedResult)
                            .then(resolve)
                            .catch(reject);
                    });
            });
        }

        function parseResult(result) {
            let parsedResult = [];
            for (let item of result) {
                parsedResult.push({
                    code: item.Code,
                    name: item.Description,
                });
            }

            return parsedResult;
        }

        function saveIntoMemcached(carriers) {
            return new Promise((resolve, reject) => {
                MemcachedHelper
                    .getKey(MemcachedKeys.carriers)
                    .then((cachedCarriers) => {
                        if (cachedCarriers) {
                            resolve(carriers);
                        } else {
                            MemcachedHelper
                                .setKey(MemcachedKeys.carriers, carriers)
                                .then(() => resolve(carriers))
                                .catch(reject);
                        }
                    });
            });
        }
    }
}
export default AirportModel;