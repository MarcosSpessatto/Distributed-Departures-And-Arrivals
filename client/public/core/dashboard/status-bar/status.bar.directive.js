(function () {
    angular
        .module('airports')
        .directive('statusBar', StatusBarDirective);

    function StatusBarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/status-bar/status-bar.html',
            link: linkFunc,
            controller: StatusBarController,
            controllerAs: 'status',
            bindToController: true
        };

        function linkFunc() {

        }
    }

    StatusBarController.$inject = ['$scope', 'DashboardService'];
    function StatusBarController($scope, DashboardService) {
        var vm = this;
        vm.connected = false;

        vm.$onInit = init();

        function init() {
            verifyConnection();
            registerListeners();
        }

        function registerListeners() {
            $scope.$on('establishConnection', function () {
                verifyConnection();
            });
        }

        function verifyConnection() {
            vm.connected = DashboardService.isConnected();
        }

    }
})();