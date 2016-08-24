/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch')
    .controller('detailsCtrl', function($scope, searchRepository, $stateParams, $filter){
        $scope.sortOptions = {fieldName: "Size", sortReverse: false};
        var searchid = $stateParams.id;
        var searchLimit;
        $scope.pagingOptions = {curPage: 0, pageSize: 10, totalPages:0 };
        $scope.data = {paged: [], allFiles:[], FilteredFiles:[]};
        $scope.searchpath = "";
        $scope.filterBy = "";

        $scope.splitPath = function(str){
            return str.split('.')[1];
        };
        
        $scope.searchByPath = function(){
            $scope.data.FilteredFiles = [];
            if ($scope.searchpath !==''){
                $scope.data.FilteredFiles = $scope.data.allFiles.filter(function(item){
                    var path = item.Path.toLowerCase();
                    if (path.match($scope.searchpath.toLowerCase()))
                        return item;
                });
                setTotalPages($scope.data.FilteredFiles.length);
                doLocalSorting();
                $scope.changePage(0, $scope.data.FilteredFiles, $scope.data.FilteredFiles.length);
            }
        };
        
        $scope.clearSearch = function(){
            $scope.searchpath = '';
            setTotalPages();
            $scope.changePage(0);
        };
        
        $scope.latestDate = function(created, modified) {
            if (created >= modified) return created;
            else return modified;
        };

        var getFiles = function(nextId, startPage){
            searchRepository.findAllFiles(searchid,nextId,searchLimit).then(function(files){
                $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                setTotalPages();
                doLocalSorting();
                $scope.changePage(startPage);
            });
        };


        var setTotalPages = function(datalen){
            if (!datalen){
                datalen = $scope.search.Count;
            }
            $scope.pagingOptions.totalPages = Math.ceil(datalen/$scope.pagingOptions.pageSize);
        };

        $scope.changePage = function(thisPage, dataSet, pageSize){
            if (!dataSet){
                dataSet = $scope.data.allFiles;
            }
            if (!pageSize){
                pageSize = $scope.pagingOptions.pageSize;
            }
            $scope.data.paged = [];
            $scope.pagingOptions.curPage = thisPage;
            var nextId = thisPage*pageSize;
            
            for(var i=0; i<Math.min(pageSize, (dataSet.length - (pageSize * thisPage))); i++){
                $scope.data.paged[i] =  dataSet[nextId+i];
            }
        
            if(nextId && nextId%searchLimit === 0){
                getFiles(nextId,thisPage+1);
            }
        };

        searchRepository.findOneSearch(searchid).then(function(searches){
            $scope.search = searches.data;
            searchLimit = Math.min(1000, $scope.search.Count);
            $scope.pagingOptions.pageSize = Math.min($scope.pagingOptions.pageSize, $scope.search.Count);
            getFiles(0,0);
        });
        
        $scope.columnHeaderClick = function(column){
            $scope.sortOptions.lastFieldName = $scope.sortOptions.fieldName;
            $scope.sortOptions.fieldName = column;
            if ($scope.sortOptions.fieldName === $scope.sortOptions.lastFieldName) {
                $scope.sortOptions.sortReverse = $scope.sortOptions.sortReverse === false ? true : false;
            }else{
                $scope.sortOptions.sortReverse = false;
            }
            doLocalSorting();
    };
        
        var doLocalSorting = function (){
            if ($scope.sortOptions.sortReverse === false){
                $scope.data.allFiles = $filter('orderBy')($scope.data.allFiles, $scope.sortOptions.fieldName);
            }else{
                $scope.data.allFiles = $filter('orderBy')($scope.data.allFiles, '-' + $scope.sortOptions.fieldName);
            }
        };

        $scope.resultsPerPage = function(number){
            $scope.pagingOptions.pageSize = number;
            setTotalPages();
            $scope.changePage(0);
        };
        
        $scope.selectChange = function(){
            console.log($scope.filterBy);
        }
    });