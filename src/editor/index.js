/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// Used as input to Rollup to generate the prosemirror js file

import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {fixTables} from "prosemirror-tables"

import {getParser, getSerializer, getRenderer} from "./markdown";
import {getSchema} from "./core/schema"
import {setupPlugins} from "./core/index"
import {$node} from "./core/util/node"
import {registerPreset, registerPlugin} from "./core/plugins"

import MentionProvider from "./core/plugins/mention/provider"

import * as menu from './core/menu'
import {getPlugins} from "./core/plugins/index";

class MarkdownEditor {
    constructor(selector, options = {}) {
        this.$ = $(selector);
        this.initContext(options);
        this.parser = getParser(this.context);
        this.serializer = getSerializer(this.context);
        this.renderer = getRenderer(this.context);
    }

    initContext(options) {
        this.context = {
            options: options
        };

        this.context.editor = this;
        this.context.id = this.$.attr('id');

        this.context.options.preset = options.preset || 'full';

        if(Array.isArray(options.exclude) && !options.exclude.length) {
            this.context.options.exclude = undefined;
        }

        if(Array.isArray(options.include) && !options.include.length) {
            this.context.options.include = undefined;
        }

        getPlugins(this.context);
        getSchema(this.context);
    }

    init(md) {
        if(this.editor) {
            this.editor.destroy();
        }

        let state = EditorState.create({
            doc: this.parser.parse(md),
            plugins: setupPlugins(this.context)
        });

        let fix = fixTables(state);
        state = (fix) ? state.apply(fix.setMeta("addToHistory", false)) : state;

        this.editor =  new EditorView(this.$[0], {
            state: state
        });

        this.$menuBar = this.$.find('.ProseMirror-menubar').hide();

        this.$editor = $(this.editor.dom).on('focus', () => {
            this.$menuBar.show();
        }).on('blur', () => {
            this.$menuBar.hide();
        });

        this.trigger('init');
    }
    
    serialize() {
        return this.serializer.serialize(this.editor.state.doc);
    }

    trigger(trigger, args) {
        this.$.trigger(trigger, args);
    }

    on(event, handler) {
        this.$.on(event, handler);
    }

    render() {
        return this.renderer.render(this.$.text());
    }
}

window.prosemirror = {
    MarkdownEditor: MarkdownEditor,
    EditorState: EditorState,
    getRenderer: getRenderer,
    plugin: {
        registerPreset: registerPreset,
        registerPlugin: registerPlugin
    },
    menu: menu,
    find:find,
    $node: $node,
    MentionProvider: MentionProvider
};

