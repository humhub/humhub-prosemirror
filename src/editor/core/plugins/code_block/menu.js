/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {blockTypeItem} from "../../menu/menu"

function makeCodeBlock(context) {
    return blockTypeItem(context.schema.nodes.code_block, {
        title: context.translate("Change to code block"),
        label: context.translate("Code")
    })
}

export function menu(context) {
    return [
        {
            id: 'makeCodeBlock',
            node: 'code_block',
            group: 'types',
            item: makeCodeBlock(context)
        }
    ]
}