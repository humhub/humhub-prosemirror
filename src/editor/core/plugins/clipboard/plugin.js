/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model'
import { getParser } from "../../../markdown/parser"
import {triggerUpload} from "../upload/service"

const clipboardPlugin = (context) => {
    let parser = getParser(context);
    return new Plugin({
        props: {
            clipboardTextParser: $.proxy(parser.parse, parser),
            transformPasted: (slice) => {
                if(slice && slice instanceof Node && slice.type == context.schema.nodes.doc) {
                    return new Slice(slice.content, 0, 0)
                }

                return slice;
            },
            handleDOMEvents: {
                paste: (view, e) => {
                    if(e.clipboardData.files && e.clipboardData.files.length) {
                        triggerUpload(view.state, view, context, e.clipboardData.files);
                        e.preventDefault();
                    }
                }
            }
        },
    });
};

export {clipboardPlugin}