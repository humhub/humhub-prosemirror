/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {blockTypeItem} from "../../menu/menu"

function makeCodeBlock(options) {
    return blockTypeItem(options.schema.nodes.code_block, {
        title: "Change to code block",
        label: "Code"
    })
}

export function menu(options) {
    return [
        {
            id: 'makeCodeBlock',
            node: 'code_block',
            group: 'types',
            item: makeCodeBlock(options)
        }
    ]
}