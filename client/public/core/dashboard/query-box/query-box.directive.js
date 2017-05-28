(function(){
    'use strict';
    angular
        .module('airports')
        .directive('queryBox', QueryBoxDirective);

    function QueryBoxDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/query-box/query-box.html',
            link: linkFunc,
            controller: QueryBoxController,
            controllerAs: 'query',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    QueryBoxController.$inject = ['$scope'];

    function QueryBoxController($scope){
        var vm = this;
    }
})();