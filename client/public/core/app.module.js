(function () {
    'use strict';
    angular.module('airports', [
        'ngRoute'
    ])
        .config(config);

    config.$inject = ['$routeProvider', '$qProvider'];
    function config($routeProvider, $qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        $routeProvider
            .when("/configuration", {
                templateUrl: "core/configuration/configuration.html",
                controller: "ConfigurationController",
                controllerAs: 'configuration'
            })
            .when("/dashboard", {
                templateUrl: "core/dashboard/dashboard.html",
                controller: "DashboardController",
                controllerAs: 'dashboard'
            })
            .otherwise({redirectTo: '/configuration'});
    }
})();