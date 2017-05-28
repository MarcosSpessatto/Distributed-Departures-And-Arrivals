(function(){
    'use strict';
    angular
        .module('airports')
        .directive('carriersList', CarriersListDirective);

    function CarriersListDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/available-list/carriers/carriers-list.html',
            link: linkFunc,
            controller: CarriersListController,
            controllerAs: 'carriers',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    CarriersListController.$inject = ['$scope'];

    function CarriersListController($scope){
        var vm = this;
    }
})();