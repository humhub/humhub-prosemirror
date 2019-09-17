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
import save from "./save";
import {PluginRegistry} from "./registry";

const registry = new PluginRegistry();

let registerPlugin = function(plugin, options) {
    registry.register(plugin, options);
};

let registerPreset = function(id, plugins) {
    registry.registerPreset(id, plugins);
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
registerPlugin(anchors);
registerPlugin(fullscreen, 'markdown');
registerPlugin(resizeNav, 'markdown');
registerPlugin(maxHeight, 'markdown');
registerPlugin(save, 'markdown');

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

registerPreset('document', {
    extend: 'normal',
    callback: function(addToPreset) {
        addToPreset('anchor', 'document', {
            'before': 'fullscreen'
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

    let presetMap = registry.getPresetRegistry(context);

    let toExtend = presetMap.get(options.preset) ?  presetMap.get(options.preset) : registry.plugins;

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
        options.include.forEach((pluginId) => {
            if(registry.plugins[pluginId]) {
                result.push(plugins[pluginId]);
            } else {
                console.error('Could not include plugin '+pluginId+' plugin not registered!');
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
            plugin.init(context, context.editor.isEdit());
        }

        if(context.editor.isEdit() && plugin.plugins) {
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