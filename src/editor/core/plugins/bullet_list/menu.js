/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {wrapInList} from "prosemirror-schema-list"
import {icons, cmdItem, wrapListItem} from "../../menu/menu"

function wrapBulletList(options) {
    return cmdItem(wrapInList(options.schema.nodes.bullet_list), {
        title: "Wrap in bullet list",
        icon: icons.bulletList,
        sortOrder: 600
    });
}

export function menu(options) {
    return [
        {
            id: 'wrapBulletList',
            node: 'bullet_list',
            item: wrapBulletList(options)
        }
    ]
}