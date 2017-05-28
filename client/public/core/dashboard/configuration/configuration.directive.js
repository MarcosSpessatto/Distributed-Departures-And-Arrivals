(function(){
    'use strict';
    angular
        .module('airports')
        .directive('configuration', ConfigurationDirective);

    function ConfigurationDirective(){
        return {
            restrict: 'E',
            templateUrl: 'core/dashboard/configuration/configuration.html',
            link: linkFunc,
            controller: ConfigurationController,
            controllerAs: 'config',
            bindToController: true
        };

        function linkFunc(){

        }
    }

    ConfigurationController.$inject = ['$scope'];

    function ConfigurationController($scope){
        var vm = this;
    }
})();