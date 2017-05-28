(function(){
    'use strict';
    angular
        .module('airports')
        .directive('airportsList', AirportsListDirective);

    function AirportsListDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/available-list/airports/airports-list.html',
            link: linkFunc,
            controller: AirportsListController,
            controllerAs: 'airports',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    AirportsListController.$inject = ['$scope', 'DashboardService'];

    function AirportsListController($scope, DashboardService){
        var vm = this;
        vm.airports = [];

        vm.$onInit = init;

        function init() {
            DashboardService
                .getAirports()
                .then(function (airports) {
                    vm.airports = airports;
                })
                .catch(function (err) {
                    Materialize.toast(err.message, 4000);
                });
        }

    }
})();