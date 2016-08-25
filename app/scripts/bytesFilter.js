/**
 * Created by dalia on 23/08/16.
 */
'use strict';

angular.module('networkSearch')
    .filter('bytes', function() {
    return function(kbytes, precision) {
        if (isNaN(parseFloat(kbytes)) || !isFinite(kbytes)) return '-';
        var bytes = kbytes * 1024;
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});