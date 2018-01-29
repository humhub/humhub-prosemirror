/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {wrapInList} from "prosemirror-schema-list"
import {icons, cmdItem, wrapListItem} from "../../menu/menu"

function wrapOrderedList(context) {
    return cmdItem(wrapInList(context.schema.nodes.ordered_list), {
        title: context.translate("Wrap in ordered list"),
        icon: icons.orderedList,
        sortOrder: 200
    });
}

export function menu(context) {
    return [
        {
            id: 'wrapOrderedList',
            node: 'ordered_list',
            group: 'format',
            item: wrapOrderedList(context)
        }
    ]
}