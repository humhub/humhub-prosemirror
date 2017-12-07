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
import {$node} from "./core/util"

class MarkdownEditor {
    constructor(selector, options = {}) {
        this.options = options;
        if(!this.options.schema) {
            this.options.schema = getSchema(options);
        }

        /*if(!this.options.menuMode) {
            this.options.menuMode = 'hover';
        }*/

        this.$ = $(selector);
        this.parser = getParser(this.options);
        this.serializer = getSerializer(this.options);
        this.renderer = getRenderer(this.options);
    }

    init(md) {
        if(this.editor) {
            this.editor.destroy();
        }

        let state = EditorState.create({
            doc: this.parser.parse(md),
            plugins: setupPlugins(this.options)
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
}

window.prosemirror = {
    MarkdownEditor: MarkdownEditor,
    EditorState: EditorState,
    getRenderer: getRenderer,
    find:find,
    $node: $node
};

