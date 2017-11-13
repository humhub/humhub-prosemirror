/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

module.exports = {
  //input: "./src/editor/index.js",
  output: {format: "iife", file: "dist/editor.js"},
  sourcemap: true,
  plugins: [
      require('rollup-plugin-json')(),
      require("rollup-plugin-buble")(),
      require('rollup-plugin-node-resolve')(),
      require('rollup-plugin-commonjs')()
  ],
  //external(id) { return !/^[\.\/]/.test(id) }
};
