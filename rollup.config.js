// rollup.config.js
// NOTE: Before using this configuration, change the parameter 'type' in package.json to 'module'
// Using: Run this command in the console: rollup -c

import pluginEslint from "@rollup/plugin-eslint";
import pluginResolve from "@rollup/plugin-node-resolve";
import pluginJson from "@rollup/plugin-json";
import pluginCommonjs from "@rollup/plugin-commonjs";
import { babel as pluginBabel } from "@rollup/plugin-babel";
import pluginReplace from "@rollup/plugin-replace";

export default {
    external: ['jquery'],
    input: 'src/editor/index.js',
    output: {
        file: 'dist/humhub-editor.js',
        format: 'iife',
        generatedCode: "es2015",
        compact: true,
    },
    plugins: [
        pluginResolve({
            preferBuiltins: false,
            extensions: ['.js', '.json']
        }),
        pluginJson(),
        pluginCommonjs(),
        pluginBabel({
            babelHelpers: 'bundled',
            babelrc: false,
            configFile: false,
            presets: [
                ['@babel/preset-env', {
                    // Same ES5 output level as the previously used buble plugin
                    targets: {ie: '11'},
                    modules: false,
                    // Keep for-of loops untouched (as buble did with `forOf: false`)
                    exclude: ['transform-for-of', 'transform-regenerator'],
                }],
            ],
            exclude: [
                'node_modules/@lezer/**'
            ]
        }),
        pluginReplace({
            'process.env.NODE_ENV': JSON.stringify( 'development' ),
            'preventAssignment': true
        })
    ],
};
