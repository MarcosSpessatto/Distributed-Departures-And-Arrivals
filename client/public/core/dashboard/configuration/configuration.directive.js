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
        vm.server = {};

        vm.$onInit = onInit;
        vm.connect = connect;
        vm.disconnect = disconnect;


        function onInit(){
            registerListeners();
        }

        function connect() {
            DashboardService
                .connect(vm.server)
                .then(DashboardService.isConnected())
                .catch(function(err){
                   Materialize.toast('Error ', 4000)
                });
        }

        function disconnect(){
            DashboardService
                .disconnect()
        }

        function registerListeners(){
            $scope.$on('establishConnection', function(event, connected){
                vm.connected = connected;
            })
        }
    }
})();