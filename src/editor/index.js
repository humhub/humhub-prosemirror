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
import {setupPlugins} from "./plugins/index"
import {markdownParser, markdownSchema, markdownSerializer, markdownRenderer} from "./markdown/index";

class MarkdownEditor {
    constructor(selector) {
        this.$ = $(selector);
    }

    init(md) {
        if(this.editor) {
            this.editor.destroy();
        }

        let state = EditorState.create({
            doc: markdownParser.parse(md),
            plugins: setupPlugins({schema: markdownSchema})
        });

        let fix = fixTables(state);
        state = (fix) ? state.apply(fix.setMeta("addToHistory", false)) : state;

        this.editor =  new EditorView(this.$[0], {
            state: state
        });

        this.trigger('init');
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