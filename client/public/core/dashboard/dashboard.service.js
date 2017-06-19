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
        service.executeQuery = executeQuery;

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

        function executeQuery(query) {
            return $q(function (resolve, reject) {
                $http
                    .post('/api/execute', query)
                    .then((resultQuery) => resolve(resultQuery.data))
                    .catch((err) => reject(err));
            });
        }
    }
})();
