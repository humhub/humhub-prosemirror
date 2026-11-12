/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2026 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 */

import {Plugin} from 'prosemirror-state';

/**
 * GUIDs of files uploaded through this editor (paste, drop, upload button).
 * Only those files are kept in sync with the document, files attached otherwise are never touched.
 */
const trackedGuids = new WeakMap();

const getTracked = (context) => {
    if (!trackedGuids.has(context)) {
        trackedGuids.set(context, {guids: new Set(), detached: new Map()});
    }

    return trackedGuids.get(context);
};

const trackUploadedFile = (context, guid) => {
    if (guid) {
        getTracked(context).guids.add(guid);
    }
};

const collectFileGuids = (doc) => {
    const result = new Set();

    doc.descendants((node) => {
        if (node.attrs && node.attrs.fileGuid) {
            result.add(node.attrs.fileGuid);
        }

        node.marks.forEach((mark) => {
            if (mark.attrs && mark.attrs.fileGuid) {
                result.add(mark.attrs.fileGuid);
            }
        });
    });

    return result;
};

/**
 * A file uploaded into the editor is submitted as hidden `fileList[]` input of the form. When the user removes the
 * image/link from the text, the file must not be submitted anymore, otherwise the server accepts an empty post
 * (the "message required" rule is skipped for posts with files) and attaches an invisible file.
 * When the node comes back (undo), the input is restored.
 */
const syncFileInputs = (context, doc) => {
    const tracked = getTracked(context);
    if (!tracked.guids.size) {
        return;
    }

    const $form = context.editor.$.closest('form');
    if (!$form.length) {
        return;
    }

    const present = collectFileGuids(doc);

    tracked.guids.forEach((guid) => {
        const $input = $form.find('input[name="fileList[]"]').filter((i, el) => el.value === guid);

        if (present.has(guid)) {
            if (!$input.length && tracked.detached.has(guid)) {
                $form.append(tracked.detached.get(guid));
                tracked.detached.delete(guid);
            }
        } else if ($input.length) {
            tracked.detached.set(guid, $input.first().detach());
        }
    });
};

const fileSyncPlugin = (context) => {
    context.event.on('clear', () => {
        trackedGuids.delete(context);
    });

    return new Plugin({
        view: () => ({
            update: (view, prevState) => {
                if (!view.state.doc.eq(prevState.doc)) {
                    syncFileInputs(context, view.state.doc);
                }
            }
        })
    });
};

export {fileSyncPlugin, trackUploadedFile};
