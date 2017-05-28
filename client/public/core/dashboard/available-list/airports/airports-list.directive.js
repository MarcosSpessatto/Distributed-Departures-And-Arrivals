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

    AirportsListController.$inject = ['$scope'];

    function AirportsListController($scope){
        var vm = this;
    }
})();