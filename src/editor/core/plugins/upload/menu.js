/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MenuItem} from "../../menu"
import {loaderStart, replaceLoader, removeLoader} from "../loader/plugin"

let uploadFile = (context) => {
    let mark = context.schema.marks.link;
    return new MenuItem({
        title: context.translate("Upload and include a File"),
        label: context.translate("Upload File"),
        sortOrder: 0,
        enable(state) {
            return state.selection.$from.parent.inlineContent
        },
        run(state, dispatch, view) {
            if (view.state.selection.$from.parent.inlineContent) {
                triggerUpload(state, dispatch, view, context);
            }
        }
    });
};

const triggerUpload = (state, dispatch, view, context) => {
    // A fresh object to act as the ID for this upload
    let id = {};

    let uploadWidget = humhub.require('ui.widget.Widget').instance($('#'+context.id+'-file-upload'));

    uploadWidget.off('uploadStart.richtext').on('uploadStart.richtext', (evt, response) => {
        // Replace the selection with a placeholder
        loaderStart(context, id, true);
    }).off('uploadEnd.richtext').on('uploadEnd.richtext', (evt, response) => {
        replaceLoader(context, id, createNodesFromResponse(context, response), true);
    }).off('uploadFinish.richtext').on('uploadFinish.richtext', () => {
        // Make sure our loader is removed after upload
        removeLoader(context, id, true);
    });

    uploadWidget.run();
};

let createNodesFromResponse = function(context, response) {
    let schema = context.schema;
    let nodes = [];

    // Otherwise, insert it at the placeholder's position, and remove the placeholder
    response.result.files.forEach((file) => {

        let node;
        if(file.mimeIcon === 'mime-image') {
            node = schema.nodes.image.create({src : file.url, title: file.name, alt: file.name});
        } else {
            let linkMark = schema.marks.link.create({href: file.url});
            node = schema.text(file.name, [linkMark]);
        }

        nodes.push(node);
    });

    return nodes;
};

export function menu(context) {
    return [
        {
            id: 'uploadFile',
            mark: 'link',
            group: 'insert',
            item: uploadFile(context)
        }
    ]
}