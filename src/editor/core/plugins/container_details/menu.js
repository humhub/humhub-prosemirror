/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {icons, cmdItem, wrapItem} from "../../menu"

function wrapDetails(context) {
    return wrapItem(context.schema.nodes.container_details, {
        title: context.translate("Wrap in collapsible block"),
        icon: icons.container_details,
        hideOnCollapse: true,
        sortOrder: 300
    });
}

export function menu(context) {
    return [
        {
            id: 'wrapDetails',
            node: 'container_details',
            group: 'format',
            item: wrapDetails(context)
        }
    ]
}