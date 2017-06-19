import DatabaseHelper from '../helpers/DatabaseHelper';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class AirportModel {

    getCarriers() {
        return new Promise((resolve, reject) => {
            const query = `MATCH (flight:Flight)-[:MADE_BY]->(carrier:Carrier)
                            RETURN DISTINCT carrier;`;

            DatabaseHelper
                .executeQuery(query)
                .then(mountCarrierList)
                .then(saveIntoMemcached)
                .then(carriers => resolve(carriers))
                .catch((err) => reject(err));
        });

        function mountCarrierList(records) {
            let carrierList = {carriers: []};
            let carriers;

            if (records.records.length > 0) {
                carriers = records.records
                    .map(record => record.get('carrier').properties);

                carrierList.carriers = carriers;
            }

            return carrierList;
        }

        function saveIntoMemcached(carriers) {
            return new Promise((resolve, reject) => {
                MemcachedHelper
                    .getKey(MemcachedKeys.carriers)
                    .then((cachedCarriers) => mountCarriersToCache(cachedCarriers, carriers))
                    .then((carrierListToCache) => MemcachedHelper.setKey(MemcachedKeys.carriers, carrierListToCache))
                    .then(() => resolve(carriers))
                    .catch((err) => reject(err));
            });

            function mountCarriersToCache(cachedCarriers, carriers) {
                if (!cachedCarriers)
                    cachedCarriers = [];

                cachedCarriers.push(carriers);

                return cachedCarriers;
            }
        }
    }
}
export default AirportModel;