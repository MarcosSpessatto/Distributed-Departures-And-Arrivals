import config from '../config.json';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import Memcached from 'memcached';

const options = {
    "reconnect": 300,
    "timeout": 100,
    "retry": 10,
    "retries": 2,
    "poolSize": 20
};

const memcached = new Memcached(`${config.memcachedServer}:${config.memcachedPort}`, options);

class MemcachedHelper {

    static myServer = {
        "name": config.serverName,
        "location": `127.0.0.1:${config.portListen}`,
        "yearData": config.yearData,
        "active": true
    };

    static init() {
        memcached.connect(`${config.memcachedServer}:${config.memcachedPort}`, function (err, conn) {
            if (err) throw new Error();
            MemcachedHelper.onInit();
        });

    }

    static getKey(key) {
        return new Promise((resolve, reject) => {
            memcached.get(key, (err, result) => {
                if (err)
                    reject(err);

                resolve(result);
            })
        })
    }

    static setKey(key, value) {
        return new Promise((resolve, reject) => {
            memcached.set(key, value, 15000, (err, result) => {
                if (err)
                    reject();
                resolve();
            });
        });
    }

    static onInit() {
        MemcachedHelper
            .getKey(MemcachedKeys.servers)
            .then(mountServerList)
            .then((serverList) => MemcachedHelper.setKey(MemcachedKeys.servers, serverList))
            .catch((err) => {
                throw new Error(err);
            });

        function mountServerList(results) {
            let serverList = [];

            if (results && results.servers && results.servers.length > 0)
                serverList = results.servers.filter((item) => item.name !== config.serverName);

            serverList.push(MemcachedHelper.myServer);

            return serverList;
        }
    }


}

export default MemcachedHelper;
