(function () {
    angular
        .module('airports')
        .service('DashboardService', DashboardService);

    DashboardService.$inject = ['$q', '$http', '$window', '$rootScope'];
    function DashboardService($q, $http, $window, $rootScope) {
        var service = this;

        service.name = 'DashboardService';
        service.connect = connect;
        service.disconnect = disconnect;
        service.isConnected = isConnected;
        service.getAirports = getAirports;
        service.getCarriers = getCarriers;

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
            return $q((resolve, reject) => {
                if ($window.localStorage.getItem('connectionEstablished')) {
                    $http
                        .get('/api/alive')
                        .then((alive) => {
                            $rootScope.$broadcast('establishConnection', true);
                            resolve(alive);
                        })
                        .catch((notAlive) => {
                            $rootScope.$broadcast('establishConnection', false);
                            reject(notAlive);
                        });
                } else {
                    $rootScope.$broadcast('establishConnection', false);
                    reject(false);
                }
            });
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

        function connect(server) {
            return $q(function (resolve, reject) {
                $http
                    .post('/api/connect', server)
                    .then(establishConnection)
                    .then((connection) => resolve(connection))
                    .catch((err) => reject(err));
            });
        }

        function disconnect() {
            return $q((resolve, reject) => {
                $http
                    .post('/api/disconnect')
                    .then(() => {
                        $window.localStorage.removeItem('connectionEstablished');
                        $rootScope.$broadcast('establishConnection', false);
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        }

        function establishConnection(connection) {
            $window.localStorage.setItem('connectionEstablished', true);
            $rootScope.$broadcast('establishConnection', true);

            return connection;
        }
    }
})();
