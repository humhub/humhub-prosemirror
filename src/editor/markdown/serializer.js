/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MarkdownSerializer} from "prosemirror-markdown"
import {getPlugins} from "../core/plugins"

let presets = {};

let getSerializer = (options = {}) => {
    if (options.preset && presets[options.preset]) {
        return presets[options.preset];
    }

    let serializer = createSerializer(options);

    if(options.preset) {
        presets[options.preset] = serializer;
    }

    return serializer;
};

let createSerializer = (options) => {
    const plugins = getPlugins(options);
    let nodeSpec = {};
    let markSpec = {};
    plugins.forEach((plugin) => {
        if (!plugin.schema) {
            return;
        }

        let nodes = plugin.schema.nodes || {};

        for (let key in nodes) {
            let node = nodes[key];
            if(node.toMarkdown) {
                nodeSpec[key] = node.toMarkdown
            }
        }

        let marks = plugin.schema.marks || {};

        for (let key in marks) {
            let mark = marks[key];
            if(marks.toMarkdown) {
                markSpec[key] = marks.toMarkdown
            }
        }
    });

    return new MarkdownSerializer(nodeSpec, markSpec);
};

export {getSerializer}