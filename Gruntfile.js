/**
 * Created by dalia on 22/08/16.
 */
'use strict';

module.exports = function(grunt){

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '0.0.0.0',
                    base: 'app',
                    livereload: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            files: ['app/*']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('serve', ['connect:server', 'watch']);

};