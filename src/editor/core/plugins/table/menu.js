/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MenuItem, Dropdown, icons} from "../../menu/menu"
import {wrapIn} from "prosemirror-commands"
import {TextField, openPrompt} from "../../prompt"
import {addColumnAfter, addColumnBefore, deleteColumn, addRowAfter, addRowBefore, deleteRow, deleteTable,toggleHeaderRow} from "prosemirror-tables"

function wrapTableItem(options) {
    let schema = options.schema;
    let command = wrapIn(schema.nodes.table_header);
    let itemOptions = {
        title: "Create table",
        icon: icons.table,
        sortOrder: 800,
        run(state, dispatch, view) {
            openPrompt({
                title: "Insert table",
                fields: {
                    rowCount: new TextField({label: "Rows", required: true, value: 1}),
                    columnCount: new TextField({label: "Columns", value: 1})
                },
                callback(attrs) {
                    wrapIn(schema.nodes.table_header)(view.state, dispatch);

                    for (let i = 1; i < attrs.columnCount; i++) {
                        addColumnAfter(view.state, dispatch);
                    }

                    toggleHeaderRow(view.state, dispatch);
                    toggleHeaderRow(view.state, dispatch);

                    for (let i = 1; i < attrs.rowCount; i++) {
                        addRowAfter(view.state, dispatch);
                        //toggleHeaderRow();
                    }

                    view.focus()
                }
            })
        },
        enable(state) {
            return command(state)
        },
        select(state) {
            return command(state)
        }
    };

    return new MenuItem(itemOptions);
}

export function menu(options) {
    return [
        {
            id: 'insertTable',
            node: 'table',
            item: wrapTableItem(options)
        },
        {
            id: 'tableOptions',
            node: 'table',
            item: new Dropdown(buildTableMenu(), {icon: icons.table})
        }
    ]
}

let buildTableMenu = function () {
    function item(label, cmd, sortOrder) {
        return new MenuItem({label, select: cmd, run: cmd, sortOrder: sortOrder})
    }

    return [
        item("Insert column before", addColumnBefore, 0),
        item("Insert column after", addColumnAfter, 1),
        item("Delete column", deleteColumn, 2),
        item("Insert row before", addRowBefore, 3),
        item("Insert row after", addRowAfter, 4),
        item("Delete row", deleteRow, 5),
        item("Delete table", deleteTable, 6)
    ];
};