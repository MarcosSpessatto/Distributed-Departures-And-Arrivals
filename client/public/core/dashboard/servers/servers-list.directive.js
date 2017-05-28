(function () {
    'use strict';
    angular
        .module('airports')
        .directive('serversList', ServersListDirective);

    function ServersListDirective() {
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/servers/servers-list.html',
            link: linkFunc,
            controller: ServersListController,
            controllerAs: 'servers',
            bindToController: true
        };

        function linkFunc() {

        }
    }

    ServersListController.$inject = ['$scope', 'DashboardService'];

    function ServersListController($scope, DashboardService) {
        var vm = this;
        vm.servers = [];

        vm.$onInit = init;

        function init() {
            getServers();
        }

        function getServers() {
            DashboardService
                .getServers()
                .then(function (servers) {
                    vm.servers = servers;
                })
                .catch(function(){
                    Materialize.toast('Error while load list of servers', 4000);
                });
        }
    }
})();