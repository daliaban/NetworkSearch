/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch')
    .controller('detailsCtrl', function($scope, searchRepository, $stateParams){
        var searchid = $stateParams.id;
        var searchLimit;
        $scope.pagingOptions = {curPage: 0, pageSize: 10, totalPages:0 };
        $scope.data = {paged: [], allFiles:[]};

        $scope.splitPath = function(str){
            return str.split('.')[1];
        };

        var getFiles = function(nextId, startPage){
            getTotalPages();
            searchRepository.findAllFiles(searchid,nextId,searchLimit).then(function(files){
                $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                $scope.changePage(startPage);
            })
        };


        var getTotalPages = function(){
            $scope.pagingOptions.totalPages = Math.ceil($scope.search.Count/$scope.pagingOptions.pageSize);
        };

        $scope.changePage = function(thisPage){
            $scope.data.paged = [];
            $scope.pagingOptions.curPage = thisPage;
            var nextId = thisPage*$scope.pagingOptions.pageSize;

            for(var i=0; i<$scope.pagingOptions.pageSize; i++){
                $scope.data.paged[i] =  $scope.data.allFiles[nextId+i];
            }
            console.log($scope.data.paged);
            console.log(nextId, searchLimit, thisPage);
            if(nextId && nextId%searchLimit == 0){

                getFiles(nextId,thisPage+1);
            }
        };

        searchRepository.findOneSearch(searchid).then(function(searches){
            $scope.search = searches.data;
            searchLimit = Math.min(300, $scope.search.Count);
            $scope.pagingOptions.pageSize = Math.min($scope.pagingOptions.pageSize, $scope.search.Count);
            console.log( searchLimit, $scope.search.Count);
            getFiles(0,0);
        });

    });