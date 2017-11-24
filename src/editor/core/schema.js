/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {Schema} from "prosemirror-model"
import * as coreNodes from './schema/nodes';
import * as coreMarks from './schema/marks';
import {emojiSchema} from './plugins/emoji/schema';
import {tableSchema} from './plugins/table/schema';
import {oembedSchema} from './plugins/oembed/schema';
import {mentionSchema} from './plugins/mention/schema';
import {blockquoteSchema} from './plugins/blockquote/schema';
import {paragraphSchema} from './plugins/paragraph/schema';
import {headingSchema} from './plugins/heading/schema';

let mergeSchema = function(schemaFrom, schemaWith) {
    let result = {};

    if(Array.isArray(schemaWith)) {
        result = schemaFrom;
        schemaWith.forEach((newSchema) => {
            result = mergeSchema(result, newSchema)
        })
    } else {
        result.nodes = Object.assign(schemaFrom.nodes || {}, schemaWith.nodes || {});
        result.marks = Object.assign(schemaFrom.marks || {}, schemaWith.marks || {});
    }

    return result;
};

let HTML_ESCAPE_TEST_RE = /[&<>"]/;
let HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
let HTML_REPLACEMENTS = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
};

function replaceUnsafeChar(ch) {
    return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
    if (HTML_ESCAPE_TEST_RE.test(str)) {
        return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
    }
    return str;
}

let coreSchema = {
    nodes: {
        doc: coreNodes.doc,
        horizontal_rule: coreNodes.horizontal_rule,
        code_block: coreNodes.code_block,
        ordered_list: coreNodes.ordered_list,
        bullet_list: coreNodes.bullet_list,
        list_item: coreNodes.list_item,
        text: coreNodes.text,
        image: coreNodes.image,
        hard_break: coreNodes.hard_break,
    },
    marks: {
        em: coreMarks.em,
        strong: coreMarks.strong,
        strikethrough: coreMarks.strikethrough,
        link: coreMarks.link,
        code: coreMarks.code,
    }
};

let schema = new Schema(mergeSchema(coreSchema, [paragraphSchema, blockquoteSchema, headingSchema, tableSchema, emojiSchema, oembedSchema, mentionSchema]));

export {schema};