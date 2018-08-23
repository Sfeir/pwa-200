(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('People', ['$http', Peoples]);

    function Peoples($http) {
        const API_URL = 'mocks/people.json';
        var networkPromise;
        var peoples;
        var peopleMap = new Map();

        var hasRequestPending = false;

        var service = {
            getPeoples    : getPeoples,
            getPeopleById : getPeopleById,
            getCollab     : getCollab
        };

        initialize();

        function initialize() {
            hasRequestPending = true;
            networkPromise    = $http.get(API_URL)
                .then(function(response) {
                    hasRequestPending = false;
                    if (peoples) {
                        //Replace peoples
                        Array.prototype.splice.apply(peoples, [0, peoples.length].concat(response.data));

                    } else {
                        peoples = response.data;
                    }
                    return peoples;
                });
        }

        function onResult() {
            peoples.forEach(function(people) {
                people.name = people.firstname + ' ' + people.lastname;
                peopleMap.set(people.email, people);
            });
            return peoples;
        }

        function getPeoples() {
            return networkPromise.then(onResult);
        }


        function getPeopleById(id) {
            return peopleMap.get(id);
        }

        function getCollab(email) {
            var response = {isManager : false, collab : []};
            angular.forEach(peopleMap, function(value, key) {
                if (value.manager === email) {
                    response.isManager = true;
                    response.collab.push(key);
                }
            }, response);
            return response;
        }

        return service;
    }

})();
