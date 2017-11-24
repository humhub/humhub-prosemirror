/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {Schema} from "prosemirror-model"
import {getPlugins} from "./plugins/"

let mergeSchema = function(schema, plugin) {
    if(Array.isArray(plugin)) {
        plugin.forEach((newPlugin) => {
            schema = mergeSchema(schema, newPlugin)
        })
    } else {
        schema.nodes = Object.assign(schema.nodes || {}, plugin.schema && plugin.schema.nodes || {});
        schema.marks = Object.assign(schema.marks || {}, plugin.schema && plugin.schema.marks || {});
    }

    return schema;
};

let presets = {};

let getSchema = function(options = {}) {
    if(options.schema) {
        return options.schema;
    }

    if(options.preset && presets[options.preset]) {
        return options.schema = presets[options.preset];
    }

    let schema = new Schema(mergeSchema({}, getPlugins(options)));
    if(options.preset) {
        presets[option.preset] = schema;
    }

    return options.schema = schema;
};

export {getSchema};