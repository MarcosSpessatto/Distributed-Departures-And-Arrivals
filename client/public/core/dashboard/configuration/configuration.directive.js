(function () {
    'use strict';
    angular
        .module('airports')
        .directive('configuration', ConfigurationDirective);

    function ConfigurationDirective() {
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/configuration/configuration.html',
            link: linkFunc,
            controller: ConfigurationController,
            controllerAs: 'configuration',
            bindToController: true
        };

        function linkFunc() {

        }
    }

    ConfigurationController.$inject = ['$scope', 'DashboardService'];

    function ConfigurationController($scope, DashboardService) {
        var vm = this;
        vm.connected = false;

        vm.$onInit = init;
        vm.connect = connect;
        vm.disconnect = disconnect;

        function init(){
            verifyConnection();
            registerListeners();
        }

        function connect() {
            DashboardService
                .connect(vm.server)
                .then(function(connection){

                })
                .catch(function(err){
                   Materialize.toast('Error ')
                });
        }

        function disconnect(){
            DashboardService
                .disconnect();
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