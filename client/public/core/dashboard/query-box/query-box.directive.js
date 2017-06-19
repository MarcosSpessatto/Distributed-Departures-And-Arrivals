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

    QueryBoxController.$inject = ['$scope', 'DashboardService', '$window'];

    function QueryBoxController($scope, DashboardService, $window){
        var vm = this;
        vm.query = '';
        var queryTypes = ['GETAVAILABLEYEARS', 'GETAIRPORTS', 'GETCARRIERS'];
        var delayData = 'GETDELAYDATA';
        vm.run = run;
        vm.clear = clear;


        function run(){
            vm.query = vm.query.trim();
            if(queryTypes.includes(vm.query) || vm.query.includes(delayData)){
                communicateCurrentTimestamp();
                DashboardService
                    .executeQuery({query: vm.query})
                    .then(communicateResultQuery)
                    .catch((err) => Materialize.toast(err.errorDescription));
            } else {
                Materialize.toast('Verifique o comando', 4000);
            }
        }

        function clear(){
            vm.query = '';
            communicateClear();
        }

        function communicateResultQuery(resultquery) {
            $scope.$emit('ResultQuery', resultquery);
        }

        function communicateCurrentTimestamp(){
            $scope.$emit('BeforeQueryMilliseconds', $window.performance.now());
        }

        function communicateClear(){
            $scope.$emit('ClearResults');
        }

    }
})();