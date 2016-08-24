/**
 * Created by dalia on 22/08/16.
 */
'use strict';

angular.module('networkSearch', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/index');

        $stateProvider.state('index', {
            url: '/index',
            templateUrl: '../view/main-section.html',
            controller: 'mainCtrl'
        }).state('searchDetails', {
            url: '/details/:id',
            templateUrl: '../view/details-section.html',
            controller: 'detailsCtrl'
        })
    });