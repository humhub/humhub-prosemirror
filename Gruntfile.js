module.exports = function(grunt) {

    var rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
    var rollupPluginCommonjs = require('rollup-plugin-commonjs');
    var rollupPluginJson = require('rollup-plugin-json');
    var rollupPluginBuble = require('rollup-plugin-buble');


    grunt.initConfig({
        rollup: {
            options: {
                format: 'iife',
                sourceMap: true,
                plugins: function () {
                    return [
                        rollupPluginNodeResolve({
                            main: true,
                            preferBuiltins: false
                        }),
                        rollupPluginJson(),
                        rollupPluginCommonjs(),
                        rollupPluginBuble()
                    ];
                }
            },
            pm: {
                files: {
                    'vendors/prosemirror.js': ['src/prosemirror.bundle.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-rollup');
    grunt.registerTask('default', ['rollup']);

};