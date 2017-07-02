import MemcachedHelper from '../helpers/MemcachedHelper';
import MemcachedKeys from '../constants/MemcachedKeys.json';
import ResponseFactory from '../helpers/ResponseFactory';
import ResponseMessages from '../constants/ResponseMessages.json';

class ServerModel {

    getYearsOfWholeSystem() {
        return new Promise((resolve, reject) => {
            MemcachedHelper
                .getKey(MemcachedKeys.servers)
                .then(mountServerList)
                .then((systemServers) => resolve(systemServers))
                .catch((err) => reject(err));
        });

        function mountServerList(servers) {
            return {
                years: servers
                    .map(server => server.yearData)
                    .reduce((servers, server) => servers.concat(server))
            };
        }
    }

    getServersFromWholeSystem() {
        return new Promise((resolve, reject) => {
            MemcachedHelper
                .getKey(MemcachedKeys.servers)
                .then((systemServers) => resolve(systemServers))
                .catch((err) => reject(err));
        });
    }
}
export default ServerModel;