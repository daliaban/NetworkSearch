/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch')
    .factory('searchRepository', function($http){
        var baseUrl = 'http://c7webtest.azurewebsites.net/';
       return {
           findAllSearches: function(){
               return $http.get(baseUrl + 'searches');
           },
           findOneSearch: function(id){
               return $http.get(baseUrl + 'searches/' + id);
           },
           findAllFiles: function(id, nextId, size){
               return $http.get(baseUrl + 'searches/' +id+ '/results?start=' + nextId + '&size=' + size);
           }
       }
});