import DatabaseHelper from '../helpers/DatabaseHelper';
import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class DelayDataModel {

    getDelayedData(dataToSearch) {
        return new Promise((resolve, reject) => {
            let key = this.mountKeyToSearchOnCache(dataToSearch);
            // MemcachedHelper
            //     .getKey(key)
            //     .then((cachedResults => this.verifyResult(cachedResults, dataToSearch))
        });
    }

    verifyResult(cachedResult, dataToSearch){
        return new Promise((resolve, reject) => {
            if(cachedResult)
                return cachedResult;
            else {
                this.mountQueryToExecute(dataToSearch);
            }
        })
    }

    mountKeyToSearchOnCache(dataToSearch) {
        let prefix = MemcachedKeys.data;
        let key;

        key = `${prefix}_${dataToSearch.date.year}`;

        if (hasMonth(dataToSearch))
            key += `${dataToSearch.date.month}`;
        if (hasDay(dataToSearch))
            key += `${dataToSearch.date.day}`;

        if (hasAirport(dataToSearch) && hasCarrier(dataToSearch))
            key += `_${dataToSearch.airport}_${dataToSearch.carrier}`;
        else {
            if (hasCarrier(dataToSearch))
                key += `__${dataToSearch.carrier}`;
            if (hasAirport(dataToSearch))
                key += `_${dataToSearch.airport}`;
        }

        return key;


        function hasAirport(data) {
            return data.airport && data.airport !== '***';
        }

        function hasCarrier(data) {
            return data.carrier ? true : false;
        }

        function hasMonth(data) {
            return data.date.month ? true : false;
        }

        function hasDay(data) {
            return data.date.day ? true : false;
        }
    }

    mountQueryToExecute(search){
        let query = `MATCH (flight:Flight)-[:FROM]->(origin:Airport)
                     MATCH (flight)-[:TO]->(dest:Airport)`;
    }
}
export default DelayDataModel;