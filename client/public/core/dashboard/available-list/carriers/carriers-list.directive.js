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

    CarriersListController.$inject = ['$scope', 'DashboardService'];

    function CarriersListController($scope, DashboardService){
        var vm = this;
        vm.carriers = [];

        vm.$onInit = init;

        function init(){
            DashboardService
                .getCarriers()
                .then(function(carriers){
                    vm.carriers = carriers;
                })
                .catch(function (err) {
                    Materialize.toast(err.message, 4000);
                });
        }
    }
})();