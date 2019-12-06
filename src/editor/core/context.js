/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {getPlugins} from "./plugins/index";
import {getSchema} from "./schema";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


export default class Context {
    constructor(editor, options) {
        this.event = $({});
        this.uuid = uuidv4();
        this.editor = editor;
        this.editor.context = this;
        this.id = this.editor.$.attr('id');
        this.init(options);

        // This is used to indicate active decorations relevant for some content related assumptions (e.g placeholder plugin)
        this.contentDecorations = [];

        // Map of related prosemirror plugin array by plugin id
        this.prosemirrorPlugins = {};
    }

    init(options) {
        if(options.pluginOptions) {
            $.extend(options, options.pluginOptions);
        }

        this.options = options;
        this.options.preset = options.preset || 'full';

        if(Array.isArray(options.exclude) && !options.exclude.length) {
            this.options.exclude = undefined;
        }

        if(Array.isArray(options.include) && !options.include.length) {
            this.options.include = undefined;
        }

        getPlugins(this);
        getSchema(this);
    }

    clear() {
        this.event.trigger('clear');
    }

    getPluginOption(id, option, defaultValue) {
        let pluginOptions =  this.options[id];

        if(!option) {
            return pluginOptions;
        } else if(pluginOptions) {
            return !(typeof pluginOptions[option] === 'undefined') ? pluginOptions[option] : defaultValue;
        }

        return defaultValue;
    }

    translate(key) {
        if(!this.options.translate) {
            return key;
        }

        return this.options.translate(key) || key;
    }

    getProsemirrorPlugins(id, prosemirror) {
        return this.prosemirrorPlugins[id];
    }

    getPlugin(id, prosemirror) {
        for(let i = 0; i < this.plugins.length; i++) {
            let plugin = this.plugins[i];
            if(plugin.id === id) {
                return plugin;
            }
        }
    }

    addContentDecoration(id) {
        if(this.contentDecorations.indexOf(id) < 0) {
            this.contentDecorations.push(id);
        }
    }

    removeContentDecoration(id) {
        let index = this.contentDecorations.indexOf();
        if(index >= 0) {
            this.contentDecorations.splice(index, 1);
        }
    }

    hasContentDecorations() {
        return !!this.contentDecorations.length;
    }
}

