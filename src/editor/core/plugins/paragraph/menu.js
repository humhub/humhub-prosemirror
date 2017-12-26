/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {blockTypeItem} from "../../menu/menu"

function makeParagraph(options) {
    return blockTypeItem(options.schema.nodes.paragraph, {
        title: "Change to paragraph",
        label: "Paragraph"
    })
}

export function menu(options) {
    return [
        {
            id: 'makeParagraph',
            node: 'paragraph',
            group: 'types',
            item: makeParagraph(options)
        }
    ]
}