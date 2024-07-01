/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2023 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */
import {getFileHandlerItem, getFileHandlerContainer} from "./service";

export function menu(context) {
    const links = getFileHandlerContainer(context).find('a[data-action-process=file-handler]')

    if (links.length === 0) {
        return []
    }

    let menus = []
    for (let l = 0; l < links.length; l++) {
        menus.push({
            id: 'insertFileHandler',
            node: 'file_handler',
            group: 'insert',
            item: getFileHandlerItem(context, links.eq(l), l)
        })
    }

    return menus
}
