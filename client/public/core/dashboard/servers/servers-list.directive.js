(function(){
    'use strict';
    angular
        .module('airports')
        .directive('serversList', ServersListDirective);

    function ServersListDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/servers/servers-list.html',
            link: linkFunc,
            controller: ServersListController,
            controllerAs: 'servers',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    ServersListController.$inject = ['$scope'];

    function ServersListController($scope){
        var vm = this;
    }
})();