/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch')
    .controller('mainCtrl', function($scope, searchRepository){
        searchRepository.findAllSearches().then(function(searches){
            $scope.searches = searches.data;
        });

    });