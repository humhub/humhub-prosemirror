/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, cmdItem, wrapItem} from "../../menu/menu"

function wrapDetails(context) {
    return wrapItem(context.schema.nodes.details, {
        title: context.translate("Wrap in details tag"),
        icon: icons.details,
        sortOrder: 300
    });
}

export function menu(context) {
    return [
        {
            id: 'wrapDetails',
            node: 'details',
            group: 'format',
            item: wrapDetails(context)
        }
    ]
}