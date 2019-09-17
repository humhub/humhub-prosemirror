/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {DropdownSubmenu, blockTypeItem} from "../../menu/menu"

function makeHeading(context) {
    let r = {};
    for (let i = 1; i <= 6; i++) {
        r["makeHead" + i] = blockTypeItem(context.schema.nodes.heading, {
            label: "H" + i,
            title: context.translate("Change to heading")+" " + i + ' (' + Array(i + 1).join("#") + ')',
            sortOrder: i,
            attrs: {level: i}
        })
    }

    return new DropdownSubmenu([r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6], {label: context.translate("Heading")});
}

export function menu(context) {
    return [
        {
            id: 'makeHeading',
            node: 'heading',
            group: 'types',
            item: makeHeading(context)
        }
    ]
}