// rollup.config.js
// NOTE: Before using this configuration, change the parameter 'type' in package.json to 'module'
// Using: Run this command in the console: rollup -c

import pluginEslint from "@rollup/plugin-eslint";
import pluginResolve from "@rollup/plugin-node-resolve";
import pluginJson from "@rollup/plugin-json";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginBuble from "@rollup/plugin-buble";
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
        pluginBuble({
            objectAssign: 'Object.assign',
            transforms: {
                forOf: false,
                generator: false
            },
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
