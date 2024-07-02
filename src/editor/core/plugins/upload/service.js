/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {loaderStart, replaceLoader, removeLoader} from "../loader/plugin";

const triggerUpload = function(state, view, context, files) {
    // A fresh object to act as the ID for this upload
    let id = {};

    let uploadWidget = humhub.require('ui.widget.Widget').instance($('#'+context.id+'-file-upload'));

    if (uploadWidget) {
        uploadWidget.off('uploadStart.richtext').on('uploadStart.richtext', (evt, response) => {
            // Replace the selection with a placeholder
            loaderStart(context, id, true);
        }).off('uploadEnd.richtext').on('uploadEnd.richtext', (evt, response) => {
            replaceLoader(context, id, createNodesFromResponse(context, response), true);
            console.log('UPLOADER uploadEnd.richtext')
        }).off('uploadFinish.richtext').on('uploadFinish.richtext', () => {
            // Make sure our loader is removed after upload
            removeLoader(context, id, true);
        });

        if (files) {
            uploadWidget.$.fileupload('add', {files: files});
        } else {
            uploadWidget.run();
        }
    }
}

const createNodesFromResponse = function(context, response) {
    const schema = context.schema;
    const nodes = [];

    // Otherwise, insert it at the placeholder's position, and remove the placeholder
    response.result.files.forEach((file) => {
        let node;

        if (file.error) {
            return;
        }

        if (file.mimeIcon === 'mime-image') {
            node = schema.nodes.image.create({src : file.url, title: file.name, alt: file.name, fileGuid: file.guid});
        } else {
            const linkMark = schema.marks.link.create({href: file.url, fileGuid: file.guid});
            node = schema.text(file.name, [linkMark]);
        }

        nodes.push(node);
    });

    return nodes;
};

export {
    triggerUpload,
    createNodesFromResponse,
}
