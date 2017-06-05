(function () {
    'use strict';
    angular.module('airports')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['DashboardService', '$scope'];

    function DashboardController(DashboardService, $scope) {
        var vm = this;
        vm.connected = false;

        init();

        function init(){
            registerListeners();
            verifyConnection();
        }

        function verifyConnection(){
            DashboardService
                .isConnected()
                .then((alive) => {
                    vm.connected = alive;
                })
                .catch(() => {
                    vm.connected = false;
                });
        }

        function registerListeners(){
            $scope.$on('establishConnection', function(event, connected){
                vm.connected = connected;
            });
        }
    }
})();