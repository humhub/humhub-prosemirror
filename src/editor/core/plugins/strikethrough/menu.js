/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, markItem} from "../../menu/menu"


function markStrikethrough(options) {
    return markItem(options.schema.marks.strikethrough, {title: "Toggle strikethrough", icon: icons.strikethrough, sortOrder: 400});
}

export function menu(options) {
    return [
        {
            id: 'markStrikethrough',
            mark: 'strikethrough',
            item: markStrikethrough(options)
        }
    ]
}