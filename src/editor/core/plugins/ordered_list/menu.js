/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {wrapInList} from "prosemirror-schema-list"
import {wrapListItem} from "../../util/commands"
import {icons, cmdItem} from "../../menu/menu"

function wrapOrderedList(options) {
    return cmdItem(wrapInList(options.schema.nodes.ordered_list), {
        title: "Wrap in ordered list",
        icon: icons.orderedList
    });
}

export function menu(options) {
    return [
        {
            id: 'wrapOrderedList',
            node: 'ordered_list',
            item: wrapOrderedList(options)
        }
    ]
}