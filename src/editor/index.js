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
import {Selection} from "prosemirror-state";

import * as prompt from './core/prompt'

import {getParser, getSerializer, getRenderer} from "./markdown"
import {setupPlugins} from "./core/index"
import {$node} from "./core/util/node"
import {registerPreset, registerPlugin, buildPlugins} from "./core/plugins"
import * as markdown from "./markdown/index"

import MentionProvider from "./core/plugins/mention/provider"

import {isSourceMode} from "./core/plugins/source/plugin";


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

        if(typeof options.edit === 'undefined') {
            options.edit = true;
        }

        let existingInstance = this.$.data('editorInstance');
        if(existingInstance && existingInstance.view) {
            existingInstance.destroy();
            this.$.data('editorInstance', this);
        }

        this.context = new Context(this, options);
        this.parser = getParser(this.context);
        this.serializer = getSerializer(this.context);
        this.renderer = getRenderer(this.context);

        if(!this.isEdit()) {
            buildPlugins(this.context);
        }

        this.$.data('editorInstance', this);
    }

    destroy() {
        // TODO: rather trigger event and handle in module
        if(this.context.$source) {
            this.context.$source.remove();
            this.context.$source = null;
        }
        this.view.destroy();

    }

    isEdit() {
        return this.context.options.edit;
    }

    clear() {
        this.destroy();
        this.context.clear();
        this.$stage = null;
        this.init();
    }

    getStage() {
        if(!this.$stage) {
            this.$stage = this.$.find('.ProseMirror');
        }
        return this.$stage;
    }

    isEmpty() {
        let doc = this.view.state.doc;
        return doc.childCount === 1 &&
            doc.firstChild.type.name === 'paragraph' &&
            doc.firstChild.content.size === 0 &&
            !this.context.hasContentDecorations()
    }

    init(md = "") {
        if(this.view) {
            this.destroy();
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

        this.$editor = $(this.view.dom);

        // TODO: put into menu class...
        if(this.$.is('.focusMenu')) {
            this.$menuBar = this.$.find('.ProseMirror-menubar').hide();

            this.$.on('focus', '.ProseMirror, textarea', () => {
                this.$menuBar.show();
            }).on('blur', (e) => {
                if(!this.$.is('.fullscreen')) {
                    this.$menuBar.hide();
                }
            });
        }



        // Dirty workaround, force inline menus to be removed, this is required e.g. if the editor is removed from dom
        $('.humhub-richtext-inline-menu').remove();
        this.trigger('init');
    }

    focus(atEnd) {
        if(typeof atEnd === 'undefined') {
            atEnd = false;
        }

        // The extra condition is required when switching to source mode, but the state is not available yet
        if(isSourceMode(this.view.state) || (this.context.$source && this.context.$source.is(':visible'))) {
            if(atEnd) {
                let end = this.context.$source.val().length;
                this.context.$source[0].setSelectionRange(end, end);
            }
            return this.context.$source.focus();
        } else {
            if(atEnd) {
                const selection = Selection.atEnd(this.view.docView.node)
                const tr = this.view.state.tr.setSelection(selection)
                const state = this.view.state.apply(tr)
                this.view.updateState(state)
            }
            this.view.focus();
        }
    }

    hasFocus() {
        return isSourceMode(this.view.state)
            ? this.context.$source.is(':focus')
            : $(this.view.dom).is(':focus');
    }
    
    serialize() {
        this.trigger('serialize');
        return isSourceMode(this.view.state)
            ? this.context.$source.val()
            : this.serializer.serialize(this.view.state.doc);
    }

    trigger(trigger, args) {
        this.context.event.trigger(trigger, args);
        this.$.trigger(trigger, args);
    }

    on(event, handler) {
        this.$.on(event, handler);
    }

    render(md) {
        md = md || this.$.text();
        return this.renderer.render(md, this);
    }
}

class MarkdownView {
    constructor(selector, options = {}) {
        this.$ = $(selector);

        options.edit = false;

        let existingInstance = this.$.data('richtextInstance');
        if(existingInstance && existingInstance.view) {
            existingInstance.destroy();
            this.$.data('richtextInstance', this);
        }

        this.context = new Context(this, options);
        this.parser = getParser(this.context);
        this.serializer = getSerializer(this.context);
        this.renderer = getRenderer(this.context);

        buildPlugins(this.context);

        this.$.data('richtextInstance', this);
    }

    init(md) {
        this.$.html(this.render(md));
    }

    render(md) {
        md = md || this.$.text();
        return this.renderer.render(md, this);
    }

    destroy() {
        this.$.html('');
    }

    clear() {
        this.destroy();
        this.context.clear();
        this.init();
    }

    isEdit() {
        return false;
    }
}

window.prosemirror = {
    MarkdownEditor: MarkdownEditor,
    MarkdownView: MarkdownView,
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