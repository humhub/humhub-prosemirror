/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, markItem} from "../../menu/menu"


function markStrong(options) {
    return markItem(options.schema.marks.strong, {title: "Toggle strong style", icon: icons.strong, sortOrder: 200});
}

export function menu(options) {
    return [
        {
            id: 'markStrong',
            mark: 'strong',
            item: markStrong(options)
        }
    ]
}