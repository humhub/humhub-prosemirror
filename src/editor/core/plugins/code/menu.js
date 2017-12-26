/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, markItem} from "../../menu/menu"


function markCode(options) {
    return markItem(options.schema.marks.code, {title: "Toggle code font", icon: icons.code, sortOrder: 500});
}

export function menu(options) {
    return [
        {
            id: 'markCode',
            mark: 'code',
            item: markCode(options)
        }
    ]
}