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
            .when("/dashboard", {
                templateUrl: "core/dashboard/dashboard.html",
                controller: "DashboardController",
                controllerAs: 'dashboard'
            })
            .otherwise({redirectTo: '/dashboard'});
    }
})();