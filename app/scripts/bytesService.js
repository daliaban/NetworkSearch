/**
 * Created by dalia on 25/08/16.
 */
'use strict';

angular.module('networkSearch')
    .factory('bytesService', function(){
        var unitmap = {
            'Bytes': 1,
            'KB': 1024,
            'MB': 1048576,
            'GB': 1073741824,
            'TB': 1099511627776
        };
        return {
            getBytes: function(unit){
                return unitmap[unit];
            }
        }
    });