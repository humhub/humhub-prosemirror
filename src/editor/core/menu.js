import {
    canInsert, wrapItem, blockTypeItem, Dropdown, DropdownSubmenu, joinUpItem, liftItem,
    selectParentNodeItem, undoItem, redoItem, icons, MenuItem, menuBar
} from "./menu/"

import {chainCommands, selectParentNode, setBlockType, toggleMark, wrapIn} from "prosemirror-commands"
import {wrapInList} from "prosemirror-schema-list"
import {TextField, openPrompt} from "./prompt"
import {markActive, markItem, linkItem, wrapListItem} from "./util/commands"
import {addColumnAfter, addColumnBefore, deleteColumn, addRowAfter, addRowBefore, deleteRow, deleteTable,toggleHeaderRow} from "prosemirror-tables"


import {getPlugins} from "./plugins/index"

function checkMenuDefinition(options, menuDefinition) {
    if(menuDefinition.node && !options.schema.nodes[menuDefinition.node]) {
        return false;
    }

    if(menuDefinition.mark && !options.schema.marks[menuDefinition.node]) {
        return false;
    }

    if(options.menu && options.menu.exclude && options.menu.exclude[nodeName]) {
        return false;
    }

    return true;
}



export function buildMenuItems(options) {
    let r = {}, type;

    let cut = arr => arr.filter(x => x);

    let groups = {
        insert: {type: 'dropdown', sortOrder: 500, label: "Insert", icon: icons.image, class: 'ProseMirror-doprdown-right', items: []}
    };

    let definitions = [groups.insert];

    getPlugins(options).forEach(function (plugin) {
        if(plugin.menu) {
            plugin.menu(options).forEach(function(menuDefinition) {
                if(checkMenuDefinition(options, menuDefinition)) {
                    if(menuDefinition.group && groups[menuDefinition.group]) {
                        groups[menuDefinition.group].items.push(menuDefinition.item);
                    } else if(!menuDefinition.group) {
                        definitions.push(menuDefinition.item);
                    }
                }
            });
        }
    });

    return definitions;
    
    if (type = schema.nodes.table) {
        r.insertTable = wrapTableItem(schema, {
            title: "Create table",
            icon: icons.table
        });

        r.tableDropDown = new Dropdown(buildTableMenu(), {icon: icons.table});
    }
    if (type = schema.nodes.blockquote)
        r.wrapBlockQuote = wrapItem(type, {
            title: "Wrap in block quote",
            icon: icons.blockquote
        })
    if (type = schema.nodes.paragraph)
        r.makeParagraph = blockTypeItem(type, {
            title: "Change to paragraph",
            label: "Paragraph"
        })
    if (type = schema.nodes.code_block)
        r.makeCodeBlock = blockTypeItem(type, {
            title: "Change to code block",
            label: "Code"
        })
    if (type = schema.nodes.heading)
        for (let i = 1; i <= 10; i++)
            r["makeHead" + i] = blockTypeItem(type, {
                title: "Change to heading " + i,
                label: "H" + i+' <small>('+Array(i+1).join("#")+')</small>',
                attrs: {level: i}
            })
    if (type = schema.nodes.horizontal_rule) {
        let hr = type
        r.insertHorizontalRule = new MenuItem({
            title: "Insert horizontal rule",
            label: "Horizontal rule",
            enable(state) {
                return canInsert(state, hr)
            },
            run(state, dispatch) {
                dispatch(state.tr.replaceSelectionWith(hr.create()))
            }
        })
    }

    if (type = schema.nodes.heading) {

        let options = blockTypeItem(type, {
            icon: icons.headline
        }).options;

        //r.headLineMenu = new Dropdown(cut([r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6]), options);
    }

    //r.upload =

    r.insertMenu = new Dropdown(cut([r.insertImage, r.insertHorizontalRule]), {label: "Insert", icon: icons.image, class: 'ProseMirror-doprdown-right'});
    r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([
       r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6
     ]), {label: "Heading"})]), {icon: icons.text})

   // r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock]), {label: "Block Type", icon:icons.embed});

    r.inlineMenu = [cut([r.typeMenu, getItemBySchema(schema.marks.strong), getItemBySchema(schema.marks.em), getItemBySchema(schema.marks.code), getItemBySchema(schema.marks.link)])];

    //selectParentNodeItem -> don't know if we should add this one

    r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem, liftItem])];

    r.fullMenu = r.inlineMenu.concat(r.blockMenu, [[r.insertTable, r.tableDropDown, r.insertMenu]]);

    return r
}

let getItemBySchema = function (type) {

    if (!type) {
        return;
    }

    switch (type.name) {
        case 'strong':
            return markItem(type, {title: "Toggle strong style", icon: icons.strong});
        case 'em':
            return markItem(type, {title: "Toggle emphasis", icon: icons.em});
        case 'code':
            return markItem(type, {title: "Toggle code font", icon: icons.code});
        case 'link':
            return linkItem(type);
        case 'image':
            return insertImageItem(type);
        case 'bullet_list':
            return wrapListItem(type, {
                title: "Wrap in bullet list",
                icon: icons.bulletList
            });
        case 'ordered_list':
            return wrapListItem(type, {
                title: "Wrap in ordered list",
                icon: icons.orderedList
            });
        case 'table':
            return wrapTableItem(schema, {
                title: "Create table",
                icon: icons.table
            });
        case 'blockquote':
            return wrapItem(type, {
                title: "Wrap in block quote",
                icon: icons.blockquote
            });
        case 'paragraph':
            return blockTypeItem(type, {
                title: "Change to paragraph",
                label: "Paragraph"
            });
        case 'heading':
            let result = [];
            for (let i = 1; i <= 10; i++) {
                result["makeHead" + i] = blockTypeItem(type, {
                    title: "Change to heading " + i,
                    label: "H" + i+' ('+Array(i).join("#")+')',
                    attrs: {level: i}
                })
            }
            return result;
        case 'horizontal_rule':
            let hr = schema.nodes.horizontal_rule;
            return new MenuItem({
                title: "Insert horizontal rule",
                label: "Horizontal rule",
                enable(state) {
                    return canInsert(state, hr)
                },
                run(state, dispatch) {
                    dispatch(state.tr.replaceSelectionWith(hr.create()))
                }
            });
    }
};

export function wrapTableItem(schema, options) {
    let command = wrapIn(schema.nodes.table_header);
    let passedOptions = {
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
    }
    for (let prop in options) passedOptions[prop] = options[prop]
    return new MenuItem(passedOptions)
}

export function buildMenu(options) {
    let menu = buildMenuItems(options);
    return menuBar({
        content: menu,
        floating: false
    });
}

let buildTableMenu = function () {
    function item(label, cmd) {
        return new MenuItem({label, select: cmd, run: cmd})
    }

    return [
        item("Insert column before", addColumnBefore),
        item("Insert column after", addColumnAfter),
        item("Delete column", deleteColumn),
        item("Insert row before", addRowBefore),
        item("Insert row after", addRowAfter),
        item("Delete row", deleteRow),
        item("Delete table", deleteTable),
        //item("Toggle header column", toggleHeaderColumn),
        //item("Toggle header row", toggleHeaderRow),
        //item("Toggle header cells", toggleHeaderCell),
        //item("Make cell green", setCellAttr("background", "#dfd")),
        //item("Make cell not-green", setCellAttr("background", null))
    ];
};
