import DatabaseHelper from '../helpers/DatabaseHelper';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class AirportModel {

    getAirports() {
        return new Promise((resolve, reject) => {
            const query = `MATCH (origin:Airport)<-[:FROM]-(flight:Flight)-[:TO]->(dest:Airport)
                            WITH origin, dest AS airports
                            RETURN DISTINCT airports;`;

            DatabaseHelper
                .executeQuery(query)
                .then(mountAirportList)
                .then(saveIntoMemcached)
                .then(airports => resolve(airports))
                .catch((err) => reject(err));
        });

        function mountAirportList(records) {
            let airportList = {airports: []};
            let airports;

            if (records.records.length > 0) {
                airports = records.records
                    .map(record => record.get('airports').properties);

                airportList.airports = airports;
            }

            return airportList;
        }

        function saveIntoMemcached(airports) {
            return new Promise((resolve, reject) => {
                MemcachedHelper
                    .getKey(MemcachedKeys.airports)
                    .then((cachedAirports) => mountAirportsToCache(cachedAirports, airports))
                    .then((airportListToCache) => MemcachedHelper.setKey(MemcachedKeys.airports, airportListToCache))
                    .then(() => resolve(airports))
                    .catch((err) => reject(err));
            });

            function mountAirportsToCache(cachedAirports, airports) {
                if (!cachedAirports)
                    cachedAirports = [];

                cachedAirports.push(airports);

                return cachedAirports;
            }
        }
    }
}
export default AirportModel;