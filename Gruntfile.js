module.exports = function(grunt) {

    let rollupPluginNodeResolve = require('@rollup/plugin-node-resolve');
    let rollupPluginCommonjs = require('@rollup/plugin-commonjs');
    let rollupPluginJson = require('@rollup/plugin-json');
    let rollupPluginBuble = require('@rollup/plugin-buble');
    let rollupPluginReplace = require('@rollup/plugin-replace');

    let path = require("path");

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
        copy: {
            mocha: {
                files: [
                    {
                        expand: true,
                        cwd: path.dirname(require.resolve("mocha/mocha")),
                        src: 'mocha.css',
                        dest: 'test/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: './dist',
                        src: 'humhub-editor.js',
                        dest: 'test/',
                        filter: 'isFile'
                    },
                ]
            }
        },
        rollup: {
            options: {
                format: 'iife',
                sourceMap: true,
                plugins: function () {
                    return [
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['rollup', 'copy']);

};