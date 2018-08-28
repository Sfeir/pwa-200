(function() {
    'use strict';

    angular
        .module('peopleApp')
        .config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: './angularjs/home/home.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            })
            .when('/people', {
                templateUrl: './angularjs/list/list.html',
                controller: 'ListController',
                controllerAs: 'listCtrl'
            })
            .when('/people/skill/:skill', {
                templateUrl: './angularjs/skills/skills.html',
                controller: 'SkillsController',
                controllerAs: 'skillsCtrl'
            })
            .when('/people/:id', {
                templateUrl: './angularjs/details/details.html',
                controller: 'DetailsController',
                controllerAs : 'detailsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
})();
