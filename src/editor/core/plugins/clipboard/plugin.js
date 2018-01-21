/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import { Plugin } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model'
import { getParser } from "../../../markdown/parser"

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
            }
        }
    });
};

export {clipboardPlugin}