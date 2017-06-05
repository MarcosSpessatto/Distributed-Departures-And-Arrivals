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

    StatusBarController.$inject = ['$scope'];
    function StatusBarController($scope) {
        var vm = this;
        vm.connected = false;

        vm.$onInit = init();

        function init() {
            registerListeners();
        }

        function registerListeners(){
            $scope.$on('establishConnection', function(event, connected){
                vm.connected = connected;
            });
        }

    }
})();