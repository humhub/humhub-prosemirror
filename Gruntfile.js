module.exports = function(grunt) {

    let rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
    let rollupPluginCommonjs = require('rollup-plugin-commonjs');
    let rollupPluginJson = require('rollup-plugin-json');
    let rollupPluginBuble = require('rollup-plugin-buble');


    grunt.initConfig({
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['rollup'],
                options: {
                    spawn: false,
                },
            },
        },
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
                    'dist/editor.js': ['src/editor/index.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.registerTask('default', ['rollup']);

};