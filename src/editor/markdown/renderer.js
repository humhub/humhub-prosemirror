/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import markdownit from "markdown-it"
import {getPlugins} from "../core/plugins"

let presets = {};

let getRenderer = (options = {}) => {
    if (options.preset && presets[options.preset]) {
        return presets[options.preset];
    }

    let renderer = createRenderer(options);

    if(options.preset) {
        presets[options.preset] = renderer;
    }

    return renderer;
};

let createRenderer = function(options) {
    let markdownItOptions = options && options.markdownIt || {html: false, breaks: true};
    let renderer = markdownit(markdownItOptions);

    const plugins = getPlugins(options);
    plugins.forEach((plugin) => {
        if(plugin.registerMarkdownIt) {
            plugin.registerMarkdownIt(renderer);
        }
    });

    return renderer;
};

export {getRenderer}

/*
let defaultRenderInline = markdownRenderer.renderer.renderInline;

markdownRenderer.renderer.renderInline = function (tokens, options, env) {
    let newTokens = [];

    for(let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if(token.type === 'link_open') {
            if(token.attrGet('href') === 'asdf') {
                token.type = 'link_plugin_asdf';
                token.attrSet('content', tokens[i + 1]);
                i += 2;
            }
        }
        newTokens.push(token);
    }

    return defaultRenderInline.apply(this, [newTokens, options, env]);
};

markdownRenderer.renderer.rules.link_plugin_asdf = function(tokens, idx) {
    return '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d340697.72182655236!2d11.26165571666892!3d48.154570298809446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75f9a38c5fd9%3A0x10cb84a7db1987d!2zTcO8bmNoZW4!5e0!3m2!1sde!2sde!4v1510955566626" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>';
};*/

