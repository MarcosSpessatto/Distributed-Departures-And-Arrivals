(function () {
    angular
        .module('airports')
        .service('DashboardService', DashboardService);

    DashboardService.$inject = ['$q', '$http', '$window', '$rootScope'];
    function DashboardService($q, $http, $window, $rootScope) {
        var service = this;

        service.name = 'DashboardService';
        service.getServers = getServers;
        service.getAirports = getAirports;
        service.getCarriers = getCarriers;
        service.isConnected = isConnected;
        service.connect = connect;
        service.disconnect = disconnect;

        function getServers() {
            return $q(function (resolve, reject) {
                $http
                    .get('/api/server')
                    .then(function (servers) {
                        resolve(servers.data.servers);
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        }

        function getAirports() {
            return $q(function (resolve, reject) {
                $http
                    .get('/api/airports')
                    .then(function (airports) {
                        resolve(airports.data.airports);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            });
        }

        function isConnected() {
            return $window.localStorage.getItem('connectionEstablished');
        }

        function getCarriers() {
            return $q(function (resolve, reject) {
                $http
                    .get('/api/carriers')
                    .then(function (carriers) {
                        resolve(carriers.data.carriers);
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            });
        }

        function connect() {
            return $q(function (resolve, reject) {
                $window.localStorage.setItem('connectionEstablished', true);
                $rootScope.$broadcast('establishConnection', true);
                resolve();
            });
        }

        function disconnect() {
            $window.localStorage.removeItem('connectionEstablished');
            $rootScope.$broadcast('establishConnection', true);
        }
    }
})();
