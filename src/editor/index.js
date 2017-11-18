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

import {markdownParser, markdownSchema, markdownSerializer, markdownRenderer} from "./markdown/index";
import {setupPlugins} from "./prosemirror/index"



class MarkdownEditor {
    constructor(selector, options) {
        this.options = options || {};

        if(!this.options.schema) {
            this.options.schema = markdownSchema;
        }

        if(!this.options.menuMode) {
            this.options.menuMode = 'hover';
        }

        this.$ = $(selector);

    }

    init(md) {
        if(this.editor) {
            this.editor.destroy();
        }

        let state = EditorState.create({
            doc: markdownParser.parse(md),
            plugins: setupPlugins(this.options)
        });

        let fix = fixTables(state);
        state = (fix) ? state.apply(fix.setMeta("addToHistory", false)) : state;

        this.editor =  new EditorView(this.$[0], {
            state: state
        });


        this.$menuBar = this.$.find('.ProseMirror-menubar').hide();

        this.$editor = $(this.editor.dom).on('focus', () => {
            this.updateMenu();
        }).on('blur', () => {
            this.$menuBar.hide();
        });

        this.trigger('init');
    }

    updateMenu() {
        debugger;
        let rect = this.$editor[0].getBoundingClientRect();
        this.$menuBar.css({
            top: (rect.top - this.$menuBar.outerHeight()),
            left: rect.left
        }).show();
    }
    
    serialize() {
        return markdownSerializer.serialize(this.editor.state.doc);
    }

    trigger(trigger, args) {
        this.$.trigger(trigger, args);
    }

    on(event, handler) {
        this.$.on(event, handler);
    }
}

window.pm = {
    MarkdownEditor: MarkdownEditor,
    markdownRenderer: markdownRenderer
};