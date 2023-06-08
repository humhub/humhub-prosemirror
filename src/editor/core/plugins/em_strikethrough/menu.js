/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {icons, markItem} from "../../menu/menu";

function markEmStrikethrough(context) {
    return markItem(context.schema.marks.em_strikethrough, {
        title: context.translate("Toggle emphasis + strikethrough"),
        icon: icons.em_strikethrough,
        sortOrder: 400
    }, context);
}

export function menu(context) {
    return [
        {
            id: 'markEmStrikethrough',
            mark: 'em_strikethrough',
            group: 'marks',
            item: markEmStrikethrough(context)
        }
    ];
}
