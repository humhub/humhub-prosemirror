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
import {setupPlugins, buildMenuItems} from "./plugins/index"
import {MenuItem, Dropdown}  from "prosemirror-menu"
import {addColumnAfter, addColumnBefore, deleteColumn, addRowAfter, addRowBefore, deleteRow,
    mergeCells, splitCell, setCellAttr, toggleHeaderRow, toggleHeaderColumn, toggleHeaderCell,
    goToNextCell, deleteTable}  from "prosemirror-tables"
import {markdownParser, markdownSchema, markdownSerializer, markdownRenderer} from "./markdown/index";

let menu = buildMenuItems(markdownSchema).fullMenu;
function item(label, cmd) { return new MenuItem({label, select: cmd, run: cmd}) }
let tableMenu = [
    item("Insert column before", addColumnBefore),
    item("Insert column after", addColumnAfter),
    item("Delete column", deleteColumn),
    item("Insert row before", addRowBefore),
    item("Insert row after", addRowAfter),
    item("Delete row", deleteRow),
    item("Delete table", deleteTable),
    item("Merge cells", mergeCells),
    item("Split cell", splitCell),
    item("Toggle header column", toggleHeaderColumn),
    item("Toggle header row", toggleHeaderRow),
    item("Toggle header cells", toggleHeaderCell),
    item("Make cell green", setCellAttr("background", "#dfd")),
    item("Make cell not-green", setCellAttr("background", null))
];
menu.splice(2, 0, [new Dropdown(tableMenu, {label: "Table"})]);

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
            plugins: setupPlugins({schema: markdownSchema,  menuContent: menu})
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