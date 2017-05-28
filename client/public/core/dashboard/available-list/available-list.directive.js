(function(){
    'use strict';
    angular
        .module('airports')
        .directive('availableList', AvailableListDirective);

    function AvailableListDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/available-list/available-list.html',
            link: linkFunc,
            controller: AvailableListController,
            controllerAs: 'available',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    AvailableListController.$inject = ['$scope'];

    function AvailableListController($scope){
        var vm = this;
    }
})();