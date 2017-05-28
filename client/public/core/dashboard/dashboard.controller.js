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
            verifyConnection();
            registerListeners();
        }

        function verifyConnection(){
            vm.connected = DashboardService.isConnected();
        }

        function registerListeners(){
            $scope.$on('establishConnection', function(){
                verifyConnection();
            })
        }
    }
})();