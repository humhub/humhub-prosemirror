/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {inputRules, smartQuotes, emDash, ellipsis, InputRule} from "prosemirror-inputrules"
import {keymap} from "prosemirror-keymap"
import doc from "./doc"
import blockquote from "./blockquote"
import bullet_list from "./bullet_list"
import code from "./code"
import code_block from "./code_block"
import em from "./em"
import emoji from "./emoji"
import hard_break from "./hard_break"
import heading from "./heading"
import horizontal_rule from "./horizontal_rule"
import image from "./image"
import link from "./link"
import list_item from "./list_item"
import mention from "./mention"
import oembed from "./oembed"
import ordered_list from "./ordered_list"
import paragraph from "./paragraph"
import strikethrough from "./strikethrough"
import strong from "./strong"
import table from "./table"
import text from "./text"
import attributes from "./attributes"
import placeholder from "./placeholder"
import loader from "./loader"
import upload from "./upload"
import clipboard from "./clipboard";
import anchors from "./anchors";
import fullscreen from "./fullscreen";
import resizeNav from "./resize_nav";
import maxHeight from "./max_height";

const plugins = [];
const pluginMap = {};

const presets = {};

let registerPlugin = function(plugin, options) {
    options = options || {};

    plugins.push(plugin);
    pluginMap[plugin.id] = plugin;

    if(typeof options === 'string') {
        options = {preset:options};
    }

    if(options.preset) {
        addToPreset(plugin, options.preset, options);
    }
};

let addToPreset = function(plugin, presetId,  options) {
    if(typeof plugin === 'string') {
        plugin = pluginMap[plugin];
    }

    let preset = presets[presetId] ? presets[presetId].slice() : [];

    if(options['before'] && pluginMap[options['before']]) {
        let index = preset.indexOf(pluginMap[options['before']]);
        if (index >= 0) {
            preset.splice(index, 0, plugin);
        } else {
            console.warn('Tried appending plugin before non existing preset plugin: '+presetId+' before:'+options['before']);
            preset.push(plugin);
        }
    } else if(options['after'] && pluginMap[options['after']]) {
        let index = preset.indexOf(pluginMap[options['after']]);
        if (index >= 0) {
            preset.splice(index+1, 0, plugin);
        } else {
            console.warn('Tried appending plugin after non existing preset plugin: '+presetId+' after:'+options['after']);
            preset.push(plugin);
        }
    } else {
        preset.push(plugin);
    }

    presets[presetId] = preset;
};

let registerPreset = function(id, plugins) {

    let result = [];

    if(Array.isArray(plugins)) {
        plugins.forEach((pluginId) => {
            let plugin = pluginMap[pluginId];
            if(plugin) {
                result.push(plugin);
            }
        });
    } else if(plugins.extend) {
        let toExtend =  presets[plugins.extend];

        if(!toExtend) {
            console.error('Could not extend richtext preset '+plugins.extend+' preset not registered!');
            return;
        }

        if(plugins.exclude && Array.isArray(plugins.exclude)) {
            toExtend.forEach((plugin) => {
                if(plugin && !plugins.exclude.includes(plugin.id)) {
                    result.push(plugin);
                }
            });
        } else {
            result = toExtend.slice(0);
        }

        if(plugins.include && Array.isArray(plugins.include)) {
            plugins.include.forEach((plugin) => {
                if(!pluginMap[plugin]) {
                    console.error('Could not include plugin '+plugin+' to preset '+id+' plugin not found!');
                } else {
                    result.push(pluginMap[plugin]);
                }
            });
        }
    }

    presets[id] = result;

    if(plugins.callback) {
        plugins.callback.apply(result, [addToPreset])
    }
};

registerPlugin(doc, 'markdown');
registerPlugin(clipboard, 'markdown');
registerPlugin(loader, 'markdown');
registerPlugin(paragraph, 'markdown');
registerPlugin(blockquote, 'markdown');
registerPlugin(bullet_list, 'markdown');
registerPlugin(strong, 'markdown');
registerPlugin(code, 'markdown');
registerPlugin(code_block, 'markdown');
registerPlugin(emoji);
registerPlugin(hard_break, 'markdown');
registerPlugin(em, 'markdown');
registerPlugin(horizontal_rule, 'markdown');
registerPlugin(image, 'markdown');
registerPlugin(list_item, 'markdown');
registerPlugin(mention);
registerPlugin(oembed);
registerPlugin(ordered_list, 'markdown');
registerPlugin(heading, 'markdown');
registerPlugin(strikethrough, 'markdown');
registerPlugin(table, 'markdown');
registerPlugin(text, 'markdown');
registerPlugin(link, 'markdown');
registerPlugin(attributes, 'markdown');
registerPlugin(upload, 'markdown');
registerPlugin(placeholder, 'markdown');
registerPlugin(anchors, 'markdown');
registerPlugin(fullscreen, 'markdown');
registerPlugin(resizeNav, 'markdown');
registerPlugin(maxHeight, 'markdown');

registerPreset('normal', {
    extend: 'markdown',
    callback: function(addToPreset) {

        addToPreset('emoji', 'normal', {
            'before': 'hard_break'
        });

        addToPreset('mention', 'normal', {
            'before': 'ordered_list'
        });

        addToPreset('oembed', 'normal', {
            'before': 'ordered_list'
        });
    }
});

registerPreset('full', {
    extend: 'normal'
});

class PresetManager {
    constructor(options) {
        this.map = {};
        this.options = options;
    }

    add(options, value) {
        this.map[options.preset] = value;
    }

    create(context) {
        return this.options.create.apply(null, [context]);
    }

    static isCustomPluginSet(options) {
        return !!options.exclude || !!options.include;
    }

    check(context) {
        let options = context.options;

        if(this.options.name && context[this.options.name]) {
            return context[this.options.name];
        }

        let result = [];

        if(!PresetManager.isCustomPluginSet(options) && this.map[options.preset]) {
            result = this.map[options.preset];
        }

        if(!result || (Array.isArray(result) && !result.length)) {
            result = this.create(context);

            if(!PresetManager.isCustomPluginSet(options)) {
                this.add(options, result);
            }
        }


        if(this.options.name) {
            context[this.options.name] = result;
        }

        return result;
    }
}

let getPlugins = function(context) {
    let options = context.options;

    if(context.plugins) {
        return context.plugins;
    }

    let toExtend = presets[options.preset] ?  presets[options.preset] : plugins;

    if(!PresetManager.isCustomPluginSet(options)) {
        return context.plugins = toExtend.slice();
    }

    let result = [];
    if(options.exclude) {
        toExtend.forEach((plugin) => {
            if(plugin && !options.exclude.includes(plugin.id)) {
                result.push(plugin);
            }
        });
    }

    if(options.include) {
        options.include.forEach((include) => {
            if(plugins[include]) {
                result.push(plugins[include]);
            } else {
                console.error('Could not include plugin '+include+' plugin not registered!');
            }
        });
    }

    return context.plugins = result;
};

let buildInputRules = function(context) {
    let plugins = context.plugins;
    let schema = context.schema;

    let rules = smartQuotes.concat([ellipsis, emDash]);
    plugins.forEach((plugin) => {
        if(plugin.inputRules) {
            rules = rules.concat(plugin.inputRules(schema));
        }
    });

    return inputRules({rules})
};

let buildPlugins = function(context) {
    let plugins = context.plugins;

    let result = [];
    plugins.forEach((plugin) => {

        if(plugin.init) {
            plugin.init(context);
        }

        if(plugin.plugins) {
            let pl = plugin.plugins(context);
            if(pl && pl.length) {
                result = result.concat(pl);
                context.prosemirrorPlugins[plugin.id] = pl;
            }
        }
    });

    return result;
};

let buildPluginKeymap = function(context) {
    let plugins = context.plugins;

    let result = [];
    plugins.forEach((plugin) => {
        if(plugin.keymap) {
            result.push(keymap(plugin.keymap(context)));
        }
    });

    return result;
};


// https://github.com/ProseMirror/prosemirror/issues/710
const isChromeWithSelectionBug = !!navigator.userAgent.match(/Chrome\/(5[89]|6[012])/);

export {isChromeWithSelectionBug, PresetManager, buildPlugins, buildPluginKeymap, buildInputRules, registerPlugin, registerPreset, getPlugins}