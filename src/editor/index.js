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

import {getParser, getSerializer, getRenderer} from "./markdown"
import {setupPlugins} from "./core/index"
import {$node} from "./core/util/node"
import {registerPreset, registerPlugin} from "./core/plugins"

import MentionProvider from "./core/plugins/mention/provider"

import * as menu from './core/menu'

import Context from './core/context'

$(document).on('click.richtextProvider', function(evt) {
    if(!$(evt.target).closest('.humhub-richtext-provider:visible').length) {
        let provider = $('.humhub-richtext-provider').data('provider');
        if(provider && provider.reset) {
            provider.reset();
        } else {
            $('.humhub-richtext-provider').hide().trigger('hidden');
        }
    }
});

class MarkdownEditor {
    constructor(selector, options = {}) {
        this.$ = $(selector);
        this.context = new Context(this, options);
        this.parser = getParser(this.context);
        this.serializer = getSerializer(this.context);
        this.renderer = getRenderer(this.context);
    }

    clear() {
        this.view.destroy();
        this.context.event.trigger('clear');
        this.init();
    }

    init(md = "") {
        if(this.view) {
            this.view.destroy();
        }

        let state = EditorState.create({
            doc: this.parser.parse(md),
            plugins: setupPlugins(this.context)
        });

        let fix = fixTables(state);
        state = (fix) ? state.apply(fix.setMeta("addToHistory", false)) : state;

        this.view =  new EditorView(this.$[0], {
            state: state
        });

        this.$menuBar = this.$.find('.ProseMirror-menubar').hide();

        this.$editor = $(this.view.dom).on('focus', () => {
            this.$menuBar.show();
        }).on('blur', () => {
            if(!this.$.is('.fullscreen')) {
                this.$menuBar.hide();
            }
        });

        this.$editor = $(this.view.dom);

        this.trigger('init');
        this.trigger('afterInit');
    }
    
    serialize() {
        return this.serializer.serialize(this.view.state.doc);
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
    $node: $node,
    MentionProvider: MentionProvider
};

