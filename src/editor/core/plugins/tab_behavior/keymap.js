/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2018 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {goToNextCell} from "prosemirror-tables";
import {liftListItem, sinkListItem} from "prosemirror-schema-list";

let keymap = () => {
    const getNextSelection = (selectionStart, direction) => {
        let depth = selectionStart.depth;
        let parent;

        do {
            parent = selectionStart.node(depth);
            if (parent) {
                if (parent.type.name === "table_header" || parent.type.name === "table_cell") {
                    return goToNextCell(direction);
                }
                depth--;
            }
        } while (depth > 0 && parent);

        return null;
    };

    const getSinkListItem = (type) => sinkListItem(type);
    const getLiftListItem = (type) => liftListItem(type);

    return {
        'Tab': (state, dispatch) => {
            if (dispatch) {
                const {$from} = state.selection;
                const nodeType = $from.node($from.depth - 1).type;

                if (state.selection.empty && $from.depth > 1 && nodeType.name === "list_item") {
                    const doSinkListItem = getSinkListItem(nodeType);
                    if (doSinkListItem) {
                        doSinkListItem(state, dispatch);
                    }
                } else {
                    // Check if the focused element is a table cell
                    const nextSelection = getNextSelection($from, 1);
                    if (nextSelection) {
                        nextSelection(state, dispatch);
                    } else  {
                        dispatch(state.tr.insertText('    ')); // Inserts four spaces
                    }
                }
            }
            return true;
        },
        "Shift-Tab": (state, dispatch) => {
            if (dispatch) {
                const {$from} = state.selection;
                const nodeType = $from.node($from.depth - 1).type;

                if (state.selection.empty && $from.depth > 1 && nodeType.name === "list_item") {
                    const doLiftListItem = getLiftListItem(nodeType);
                    if (doLiftListItem) {
                        doLiftListItem(state, dispatch);
                    }
                } else {
                    const nextSelection = getNextSelection($from, -1);
                    if (nextSelection) {
                        nextSelection(state, dispatch);
                    }
                }
            }
            return true;
        }
    };
};

export {keymap};
