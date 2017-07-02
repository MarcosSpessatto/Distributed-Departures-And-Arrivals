(function () {
    angular
        .module('airports')
        .directive('results', ResultsDirective);

    function ResultsDirective() {
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/results/results.html',
            link: linkFunc,
            controller: ResultsController,
            controllerAs: 'results',
            bindToController: true
        };

        function linkFunc() {

        }
    }

    ResultsController.$inject = ['$scope', '$sce', '$window'];
    function ResultsController($scope, $sce, $window) {
        var timestamp;

        var vm = this;
        vm.timestamp;
        vm.isLoading = false;

        vm.$onInit = onInit();

        function onInit() {
            registerListeners();
        }

        function registerListeners(){
            $scope.$on('ResultQuery', (event, data) => {
                vm.isLoading = false;
                 vm.resultQuery = $sce.trustAsHtml(angular.toJson(data));
                 vm.timestamp = parseInt($window.performance.now() - timestamp);
                 console.log(vm.timestamp)
            });

            $scope.$on('ClearResults', (event) => {
                vm.resultQuery = [];
                vm.resultQuery = $sce.trustAsHtml('');
            });

            $scope.$on('BeforeQueryMilliseconds', (event, data) => {
                vm.isLoading = true;
                timestamp = data;
            });

            $scope.$on('Disconnect', (event) => {
                vm.resultQuery = [];
                vm.resultQuery = $sce.trustAsHtml('');
            })
        }

    }
})();