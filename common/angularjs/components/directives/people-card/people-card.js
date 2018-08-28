(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('peopleCard', ['$routeParams', peopleCardDirective]);

    function peopleCardDirective($routeParams) {
        return {
            scope: {
                people: '<',
                describe: '<',
                skillOn: '<'
            },
            templateUrl: './angularjs/components/directives/people-card/people-card.html',
            link : function(scope) {
                scope.mySplit = function(string) {
                    return string ? string.split('@')[0] : '';
                };
            }
        };
    }
})();
