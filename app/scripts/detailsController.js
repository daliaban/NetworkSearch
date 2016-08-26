/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch')
    .controller('detailsCtrl', function($scope, searchRepository, $stateParams, $filter, bytesService){
        $scope.sortOptions = {fieldName: "Size", sortReverse: false};
        $scope.search = {};
        var searchid = $stateParams.id;
        var searchLimit;
        $scope.pagingOptions = {curPage: 1, pageSize: 10, totalPages:0 };
        $scope.data = {paged: [], allFiles:[], showFiles:[]};
        $scope.searchpath = "";
        $scope.filterBy = {name: '', minval: '', maxval: '', minext: 'GB', maxext: 'GB', mindate: 0, maxdate: 0};

        $scope.splitPath = function(str){
            return str.split('.')[1];
        };

        var searchFiles = function(){
            $scope.data.showFiles = [];
            $scope.data.showFiles = $scope.data.allFiles.filter(function(item){
                var path = item.Path.toLowerCase();
                if (path.match($scope.searchpath.toLowerCase()))
                    return item;
            });

            setTotalPages($scope.data.showFiles.length);
        };
        
        $scope.searchByPath = function(){
            clearFilter();
            if ($scope.searchpath !== ''){
                if($scope.data.allFiles.length === $scope.search.Count){
                    searchFiles();
                    $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                }else {
                    var newsearchLimit = $scope.search.Count - searchLimit;
                    $scope.filtering = true;
                    searchRepository.findAllFiles(searchid, searchLimit, newsearchLimit).then(function (files) {
                        $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                        searchFiles();
                        doLocalSorting();
                        $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                    }).finally(function () {
                        $scope.filtering = false;
                    });
                }
            }
        };

        var filterBySize = function(minbytes, maxbytes){
            $scope.data.showFiles = [];
            $scope.data.showFiles = $scope.data.allFiles.filter(function(item){
                var size = bytesService.getBytes('KB') * item.Size;
                if ( maxbytes >= size && size >= minbytes ){
                    return item;
                }
            });

            setTotalPages($scope.data.showFiles.length);
        };

        var filterByDate = function(){
            $scope.data.showFiles = [];
            $scope.data.showFiles = $scope.data.allFiles.filter(function(item){
                var lastDate = new Date($scope.latestDate(item.Created, item.LastModified));
                var minDate = new Date($scope.filterBy.mindate);
                var maxDate = new Date($scope.filterBy.maxdate);
                if ( lastDate >= minDate  &&  maxDate >= lastDate ){
                    return item;
                }
            });

            setTotalPages($scope.data.showFiles.length);
        };

        $scope.filterByValue = function(){
            $scope.searchpath = '';
            $scope.errmsg = '';
            var newsearchLimit;
            if($scope.filterBy.name !== ''){
                if($scope.filterBy.name === 'size'){
                    var minbytes = bytesService.getBytes($scope.filterBy.minext) * parseInt($scope.filterBy.minval);
                    var maxbytes = bytesService.getBytes($scope.filterBy.maxext) * parseInt($scope.filterBy.maxval);

                    if (minbytes > maxbytes){
                        $scope.errmsg = "Minimum size cannot be greater than maximum size. Try again."
                    }else {
                        if($scope.data.allFiles.length === $scope.search.Count){
                            filterBySize(minbytes, maxbytes);
                            $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                        }else {
                            newsearchLimit = $scope.search.Count - searchLimit;
                            $scope.filtering = true;
                            searchRepository.findAllFiles(searchid, searchLimit, newsearchLimit).then(function(files){
                                $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                                filterBySize(minbytes, maxbytes);
                                doLocalSorting();
                                $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                            }).finally(function(){
                                $scope.filtering = false;
                            });
                        }
                    }
                }else if($scope.filterBy.name === 'date'){
                    if($scope.data.allFiles.length === $scope.search.Count){
                        filterBySize(minbytes, maxbytes);
                        $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                    }else {
                        newsearchLimit = $scope.search.Count - searchLimit;
                        $scope.filtering = true;
                        searchRepository.findAllFiles(searchid, searchLimit, newsearchLimit).then(function (files) {
                            $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                            filterByDate();
                            doLocalSorting();
                            $scope.changePage(1, $scope.data.showFiles, Math.min($scope.pagingOptions.pageSize, $scope.data.showFiles.length));
                        }).finally(function () {
                            $scope.filtering = false;
                        });
                    }
                }
            }
        };
        var clearFilter = function(){
            $scope.filterBy.minval = '';
            $scope.filterBy.maxval= '';
            $scope.filterBy.mindate= 0;
            $scope.filterBy.maxdate= 0;
        };
        $scope.resetData = function(){
            clearFilter();
            $scope.searchpath = '';
            $scope.data.showFiles = [];
            setTotalPages();
            doLocalSorting();
            $scope.changePage(1, $scope.data.allFiles);
        };
        
        $scope.latestDate = function(created, modified) {
            if (created >= modified) return created;
            else return modified;
        };

        var getFiles = function(nextId, startPage){
            if($scope.data.allFiles.length < $scope.search.Count) {
                $scope.loading = true;
                searchRepository.findAllFiles(searchid, nextId, searchLimit).then(function (files) {
                    $scope.data.showFiles = [];
                    $scope.data.allFiles = $scope.data.allFiles.concat(files.data);
                    setTotalPages();
                    doLocalSorting();
                    $scope.changePage(startPage, $scope.data.allFiles);
                }).finally(function () {
                    $scope.loading = false;
                });
            }else {
                setTotalPages();
                $scope.changePage(startPage, $scope.data.allFiles);
            }
        };


        var setTotalPages = function(datalen){
            if (!datalen){
                datalen = $scope.search.Count;
            }
            $scope.pagingOptions.totalPages = Math.ceil(datalen/$scope.pagingOptions.pageSize);
        };

        $scope.changePage = function(thisPage, dataSet, pageSize){
            if(!dataSet){
                if($scope.data.showFiles.length)
                    dataSet = $scope.data.showFiles;
                else dataSet = $scope.data.allFiles;

            }
            if (!pageSize){
                pageSize = $scope.pagingOptions.pageSize;
            }
            $scope.data.paged = [];
            $scope.pagingOptions.curPage = thisPage;

            var nextId = (thisPage-1)*pageSize;

            for(var i=0; i<Math.min(pageSize, (dataSet.length - (pageSize * (thisPage-1)))); i++){
                $scope.data.paged[i] =  dataSet[nextId+i];
            }

            if(nextId >= $scope.data.allFiles.length && nextId%searchLimit === 0){
                getFiles(nextId,thisPage);
            }
        };

        $scope.enterPage = function(){
            if(!$scope.search.Count){
                searchRepository.findOneSearch(searchid).then(function(searches){
                    $scope.search = searches.data;
                    //Presently the search limit is set as minumim of 1000 and Count
                    searchLimit = Math.min(10000, $scope.search.Count);
                    $scope.pagingOptions.pageSize = Math.min($scope.pagingOptions.pageSize, $scope.search.Count);
                    getFiles(0,1);
                });
            }else {
                getFiles(0,1);
            }
        };

        $scope.enterPage(); //enter page here
        
        $scope.columnHeaderClick = function(column){
            $scope.sortOptions.lastFieldName = $scope.sortOptions.fieldName;
            $scope.sortOptions.fieldName = column;
            if ($scope.sortOptions.fieldName === $scope.sortOptions.lastFieldName) {
                $scope.sortOptions.sortReverse = $scope.sortOptions.sortReverse === false;
            }else{
                $scope.sortOptions.sortReverse = false;
            }
            doLocalSorting();
            $scope.changePage(1);
    };
        
        var doLocalSorting = function (){
            if($scope.data.showFiles.length){
                if ($scope.sortOptions.sortReverse === false){
                    $scope.data.showFiles = $filter('orderBy')($scope.data.showFiles, $scope.sortOptions.fieldName);
                }else{
                    $scope.data.showFiles = $filter('orderBy')($scope.data.showFiles, '-' + $scope.sortOptions.fieldName);
                }
            }else {
                if ($scope.sortOptions.sortReverse === false){
                    $scope.data.allFiles = $filter('orderBy')($scope.data.allFiles, $scope.sortOptions.fieldName);
                }else{
                    $scope.data.allFiles = $filter('orderBy')($scope.data.allFiles, '-' + $scope.sortOptions.fieldName);
                }
            }

        };

        $scope.resultsPerPage = function(resultsno){
            $scope.pagingOptions.pageSize = resultsno;
            if ($scope.searchpath !== ''){
                $scope.searchByPath();
            }else if(($scope.filterBy.minval !== '' && $scope.filterBy.maxval !== '') || ($scope.filterBy.mindate !== 0 && $scope.filterBy.maxdate !== 0)){
                $scope.filterByValue();
            }else {
                setTotalPages();
                $scope.changePage(1);
            }
        };

    });