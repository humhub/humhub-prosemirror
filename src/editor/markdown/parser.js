/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {MarkdownParser} from "prosemirror-markdown"
import {markdownSchema} from "./schema"
import {markdownRenderer as tokenizer} from "./renderer"

let markdownParser = new MarkdownParser(markdownSchema, tokenizer, {
    blockquote: {block: "blockquote"},
    paragraph: {block: "paragraph"},
    list_item: {block: "list_item"},
    bullet_list: {block: "bullet_list"},
    ordered_list: {block: "ordered_list", getAttrs: function (tok) { return ({order: +tok.attrGet("order") || 1}); }},
    heading: {block: "heading", getAttrs: function (tok) { return ({level: +tok.tag.slice(1)}); }},
    code_block: {block: "code_block"},
    fence: {block: "code_block", getAttrs: function (tok) { return ({params: tok.info || ""}); }},
    hr: {node: "horizontal_rule"},
    emoji: {node: "emoji", getAttrs: function (tok) { return ({
        text: tok.content,
        markup: tok.markup
    }) }},
    image: {node: "image", getAttrs: function (tok) { return ({
        src: tok.attrGet("src"),
        title: tok.attrGet("title") || null,
        width: tok.attrGet("width") || null,
        height: tok.attrGet("height") || null,
        alt: tok.children[0] && tok.children[0].content || null
    }); }},
    hardbreak: {node: "hard_break"},

    em: {mark: "em"},
    strong: {mark: "strong"},
    link: {mark: "link", getAttrs: function (tok) { return ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null
    }); }},
    code_inline: {mark: "code"}
});

export {markdownParser}