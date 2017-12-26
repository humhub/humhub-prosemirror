/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, markItem} from "../../menu/menu"


function markEm(options) {
    return markItem(options.schema.marks.em, {title: "Toggle emphasis", icon: icons.em, sortOrder: 300});
}

export function menu(options) {
    return [
        {
            id: 'markEm',
            mark: 'em',
            item: markEm(options)
        }
    ]
}