/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2023 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {isHumhub} from "../../humhub-bridge"
import {canInsertLink, MenuItem} from "../../menu"

const getFileHandlerItem = function(context, link, index) {
    return new MenuItem({
        label: link.html(),
        title: link.text(),
        sortOrder: 300 + index,
        enable(state) {
            return canInsertLink(state)
        },
        run() {
            link.click()
        }
    })
}

const initFileHandler = function(context) {
    if (!isHumhub()) {
        return
    }

    humhub.event.on('humhub:file:created', (evt, file) => {
        if (typeof context.editor.view !== 'undefined') {
            const view = context.editor.view
            view.dispatch(view.state.tr.replaceSelectionWith(createFileHandlerNode(context, file), false));
        }
    })

    if (typeof(context.editor.$) !== 'undefined' && context.editor.$.length) {
        const uploadWidget = context.editor.$.closest('form').find('[data-ui-widget="file.Upload"]').last()
        if (uploadWidget.length) {
            humhub.require('ui.widget').Widget.instance(uploadWidget).on('humhub:file:uploadEnd', (evt, response) => {
                if (typeof context.editor.view !== 'undefined' &&
                    response._response.result.files instanceof Array &&
                    response._response.result.files.length) {
                    const view = context.editor.view
                    for (let i = 0; i < response._response.result.files.length; i++) {
                        console.log('FH humhub:file:uploadEnd', evt, response, response._response.result.files[i])
                        view.dispatch(view.state.tr.replaceSelectionWith(createFileHandlerNode(context, response._response.result.files[i]), false))
                    }
                }
            })
        }
    }
}

const createFileHandlerNode = function(context, file) {
    if (file.error) {
        return
    }

    const schema = context.schema
    if (file.mimeIcon === 'mime-image') {
        return schema.nodes.image.create({src : file.url, title: file.name, alt: file.name, fileGuid: file.guid})
    }

    const linkMark = schema.marks.link.create({href: file.url, fileGuid: file.guid})
    return schema.text(file.name).mark([linkMark])
}

export {
    initFileHandler,
    getFileHandlerItem
}
