/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

// Used as input to Rollup to generate the prosemirror js file

import * as state from "prosemirror-state"
import * as view from "prosemirror-view"
import * as transform from "prosemirror-transform"
import * as inputRules from "prosemirror-inputrules"
import * as commands from "prosemirror-commands"
import * as history from "prosemirror-history"
import * as keymap from "prosemirror-keymap"
import * as model from "prosemirror-model"
import * as menu from './core/menu'
import * as pmmenu from "prosemirror-menu"
import * as loader from "./core/plugins/loader/plugin"
import {fixTables} from "prosemirror-tables"

import * as prompt from './core/prompt'

import {getParser, getSerializer, getRenderer} from "./markdown"
import {setupPlugins} from "./core/index"
import {$node} from "./core/util/node"
import {registerPreset, registerPlugin, buildPlugins} from "./core/plugins"
import * as markdown from "./markdown/index"

import MentionProvider from "./core/plugins/mention/provider"



import Context from './core/context'

$(document).on('mousedown.richtextProvider', function(evt) {
    if(!$(evt.target).closest('.humhub-richtext-provider:visible').length) {
         $('.humhub-richtext-provider:visible').each(function() {
            let $provider = $(this);

            let provider = $provider.data('provider');
            if(provider && provider.reset) {
                provider.reset();
            } else {
                $provider.hide().trigger('hidden');
            }
        });
    }
});

class MarkdownEditor {
    constructor(selector, options = {}) {
        this.$ = $(selector);
        this.context = new Context(this, options);
        this.parser = getParser(this.context);
        this.serializer = getSerializer(this.context);
        this.renderer = getRenderer(this.context);

        if(!this.isEdit()) {
            buildPlugins(this.context);
        }
    }

    isEdit() {
        return this.context.options.edit || this.$.is('.ProsemirrorEditor');
    }

    clear() {
        this.view.destroy();
        this.context.clear();
        this.$stage = null;
        this.init();
    }

    getStage() {
        if(!this.$stage) {
            this.$stage = this.$.find('.humhub-ui-richtext');
        }
        return this.$stage;
    }

    isEmpty() {
        let doc = this.view.state.doc;
        return doc.childCount === 1 &&
            doc.firstChild.type.name === 'paragraph' &&
            doc.firstChild.content.size === 0 &&
            !this.context.hasContentDecorations()
    };

    init(md = "") {
        if(this.view) {
            this.view.destroy();
        }

        let editorState = state.EditorState.create({
            doc: this.parser.parse(md),
            plugins: setupPlugins(this.context)
        });

        let fix = fixTables(editorState);
        editorState = (fix) ? editorState.apply(fix.setMeta("addToHistory", false)) : editorState;

        this.view =  new view.EditorView(this.$[0], {
            state: editorState
        });

        // TODO: put into menu class...
        if(this.$.is('.focusMenu')) {
            this.$menuBar = this.$.find('.ProseMirror-menubar').hide();

            this.$editor = $(this.view.dom).on('focus', () => {
                this.$menuBar.show();
            }).on('blur', (e) => {
                if(!this.$.is('.fullscreen')) {
                    this.$menuBar.hide();
                }
            });
        }

        this.$editor = $(this.view.dom);

        // Dirty workaround, force inline menus to be removed, this is required e.g. if the editor is removed from dom
        $('.humhub-richtext-inline-menu').remove();
        this.trigger('init');
    }
    
    serialize() {
        this.trigger('serialize');
        return this.serializer.serialize(this.view.state.doc);
    }

    trigger(trigger, args) {
        this.context.event.trigger(trigger, args);
        this.$.trigger(trigger, args);
    }

    on(event, handler) {
        this.$.on(event, handler);
    }

    render() {
        return this.renderer.render(this.$.text(), this);
    }
}

window.prosemirror = {
    MarkdownEditor: MarkdownEditor,
    state: state,
    view: view,
    transform: transform,
    inputRules: inputRules,
    model: model,
    commands: commands,
    history: history,
    keymap: keymap,
    menu: menu,
    loader: loader,
    pmmenu: pmmenu,
    prompt: prompt,
    getRenderer: getRenderer,
    plugin: {
        registerPreset: registerPreset,
        registerPlugin: registerPlugin,
        markdown: markdown
    },
    $node: $node,
    MentionProvider: MentionProvider
};