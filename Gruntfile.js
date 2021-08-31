module.exports = function(grunt) {

    let rollupPluginNodeResolve = require('@rollup/plugin-node-resolve');
    let rollupPluginCommonjs = require('@rollup/plugin-commonjs');
    let rollupPluginJson = require('@rollup/plugin-json');
    let rollupPluginBuble = require('@rollup/plugin-buble');
    let rollupPluginReplace = require('@rollup/plugin-replace');
    let rollupPluginNodeBuiltins = require('rollup-plugin-node-builtins');


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
                        rollupPluginNodeBuiltins(),
                        rollupPluginNodeResolve({
                            main: true,
                            preferBuiltins: false,
                            extensions: ['.js', '.json'],
                        }),
                        rollupPluginJson(),
                        rollupPluginCommonjs({
                                namedExports: {
                                    'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
                                    'node_modules/react-dom/index.js': ['render']
                                }
                            }),
                        rollupPluginBuble(),
                        rollupPluginReplace({
                            'process.env.NODE_ENV': JSON.stringify( 'development' )
                        })
                    ];
                }
            },
            pm: {
                files: {
                    'dist/humhub-editor.js': ['src/editor/index.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-rollup');
    grunt.registerTask('default', ['rollup']);

};