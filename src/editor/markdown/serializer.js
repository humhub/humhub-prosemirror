/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MarkdownSerializer} from "prosemirror-markdown"
import {getPlugins, PresetManager} from "../core/plugins"

let presets = new PresetManager({
    name: 'serializer',
    create: (context) => {
        return createSerializer(context);
    }
});

let getSerializer = (context) => {
    return presets.check(context);
};

let createSerializer = (context) => {
    const plugins = getPlugins(context);
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
            if(mark.toMarkdown) {
                markSpec[key] = mark.toMarkdown
            } else {
                markSpec[key] = {open: '', close: ''};
            }
        }
    });

    return new MarkdownSerializer(nodeSpec, markSpec);
};

export {getSerializer}