/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import markdownit from "markdown-it"
import {getPlugins, PresetManager} from "../core/plugins"

let presets = new PresetManager({
    name: 'renderer',
    create: (options) => {
        return createRenderer(options);
    }
});

let getRenderer = (context) => {
    return presets.check(context);
};

let createRenderer = function(context) {
    let markdownItOptions = context && context.options.markdownIt || {html: false, breaks: true};
    let renderer = markdownit(markdownItOptions);

    const plugins = getPlugins(context);
    plugins.forEach((plugin) => {
        if(plugin.registerMarkdownIt) {
            plugin.registerMarkdownIt(renderer);
        }
    });

    return renderer;
};

export {getRenderer}
