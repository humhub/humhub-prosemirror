const path = require('path');
const pluginNodeResolve = require('@rollup/plugin-node-resolve');
const pluginEslint = require('@rollup/plugin-eslint');
const pluginJson = require('@rollup/plugin-json');
const pluginBuble = require('@rollup/plugin-buble');
const pluginReplace = require('@rollup/plugin-replace');
const pluginCommonjs = require('@rollup/plugin-commonjs');
const rollupTask = require('./src/grunt-rollup/tasks/rollup.js');

module.exports = function(grunt) {
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
                        cwd: path.dirname(require.resolve('mocha/mocha')),
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
                generatedCode: "es2015",
                compact: true,
                // sourcemap: true,
                plugins: [
                    pluginEslint({
                        throwOnError: true,
                        throwOnWarning: false,
                        include: ['src/**/*.js'],
                        exclude: ['node_modules/**'],
                    }),
                    pluginNodeResolve({
                        preferBuiltins: false,
                        extensions: ['.js', '.json'],
                    }),
                    pluginJson(),
                    pluginCommonjs(),
                    pluginBuble({
                        objectAssign: 'Object.assign',
                        transforms: {
                            'forOf': false,
                            'generator': false
                        },
                        exclude: [
                            'node_modules/@lezer/**'
                        ]
                    }),
                    pluginReplace({
                        'process.env.NODE_ENV': JSON.stringify( 'development' ),
                        'preventAssignment': true
                    })
                ]
            },
            pm: {
                files: {
                    'dist/humhub-editor.js': ['src/editor/index.js']
                }
            }
        }
    });

    rollupTask(grunt)
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['rollup', 'copy']);
};
