/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MenuItem, markActive} from "../../menu"
import {loaderPlugin, findPlaceholder} from "../loader/plugin"
import {TextSelection} from 'prosemirror-state'

let uploadFile = (options) => {
    let mark = options.schema.marks.link;
    return new MenuItem({
        title: "Upload and include a File",
        label: "Upload File",
        sortOrder: 0,
        enable(state) {
            return state.selection.$from.parent.inlineContent
        },
        run(state, dispatch, view) {
            if (view.state.selection.$from.parent.inlineContent) {
                triggerUpload(state, dispatch, view, options);
            }
        }
    });
};

const triggerUpload = (state, dispatch, view, options) => {
    let upload = humhub.require('ui.widget.Widget').instance($('#'+options.id+'-file-upload'));

    // A fresh object to act as the ID for this upload
    let id = {};

    // Replace the selection with a placeholder
    let tr = view.state.tr;

    if (!tr.selection.empty) {
        tr.deleteSelection();
    }

    tr.setMeta(loaderPlugin, {add: {id, pos: tr.selection.from}});

    view.dispatch(tr);

    upload.off('uploadEnd.richtext').on('uploadEnd.richtext', function(evt, response) {
        debugger;
        let pos = findPlaceholder(view.state, id);

        // If the content around the placeholder has been deleted, drop the image
        if (pos == null) {
            return;
        }

        let schema = options.schema;
        let nodes = [];

        // Otherwise, insert it at the placeholder's position, and remove the placeholder
        response.result.files.forEach((file) => {
            let linkMark = schema.marks.link.create({href: file.url});
            let node;
            if(file.thumbnailUrl) {
                node = schema.nodes.image.create({src : file.thumbnailUrl, title: file.name, alt: file.name}, null, [linkMark]);
            } else {
                node = schema.text(file.name, [linkMark]);
            }

            nodes.push(node);
        });

        view.dispatch(view.state.tr.replaceWith(pos, pos, nodes).setMeta(loaderPlugin, {remove: {id}}));
    }).off('uploadFinish.richtext').on('uploadFinish.richtext', function() {
        debugger;
        //view.dispatch(tr.setMeta(loaderPlugin, {remove: {id}}));
    });

    upload.run();
};

export function menu(options) {
    return [
        {
            id: 'uploadFile',
            mark: 'link',
            group: 'insert',
            item: uploadFile(options)
        }
    ]
}