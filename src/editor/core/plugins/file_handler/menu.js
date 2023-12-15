/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2023 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {MenuItem, canInsertLink} from "../../menu/"

function getFileHandler(context, link, index) {
    return new MenuItem({
        label: link.html(),
        sortOrder: 300 + index,
        enable(state) {
            return canInsertLink(state)
        },
        run() {
            link.click();
        }
    })
}

export function menu(context) {
    const links = context.editor.$.closest('form').find('a[data-action-process=file-handler]')

    if (links.length === 0) {
        return []
    }

    let menus = []
    for (let l = 0; l < links.length; l++) {
        console.log('FH: ', links[l])
        menus.push({
            id: 'insertFileHandler',
            node: 'file_handler',
            group: 'insert',
            item: getFileHandler(context, links.eq(l), l)
        })
    }

    return menus
}
