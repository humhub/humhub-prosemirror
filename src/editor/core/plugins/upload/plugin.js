/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model'
import twemoji from "../../twemoji"
import {getParser} from "../../../markdown/parser"

const attributesPlugin = (options) => {
    return new Plugin({
        props: {
            attributes: options.attributes
        }
    });
};

const triggerUpload = (options) => {
    let upload = humhub.require('ui.widget.Widget').instance($('#'+options.id+'-file-upload'));

    upload.off('uploadEnd.richtext').on('uploadEnd.richtext', function() {

    });

    upload.run();
};

export {triggerUpload}