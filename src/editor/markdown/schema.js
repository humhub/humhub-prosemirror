/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {schema} from "prosemirror-markdown"
import {Schema} from "prosemirror-model"
import {tableNodes} from "prosemirror-tables"

let nodes = schema.spec.nodes
    .remove('image')
    .append(tableNodes({
        tableGroup: "block",
        cellContent: "block",
        cellAttributes: {
            background: {
                default: null,
                getFromDOM(dom) {
                    return dom.style.backgroundColor || null
                },
                setDOMAttr(value, attrs) {
                    if (value) attrs.style = (attrs.style || "") + `background-color: ${value};`
                }
            }
        }
    }))
    .remove('table')
    .addToEnd('table', {
        content: "(table_row+ | table_head | table_body | table_foot)",
        tableRole: "table",
        isolating: false,
        group: "block",
        parseDOM: [{tag: "table"}],
        toDOM: function toDOM() {
            return ["table", ["tbody", 0]]
        }
    }).addToEnd('table_head', {
        content: "table_row*",
        tableRole: "head",
        parseDOM: [{tag: "thead"}],
        toDOM: function toDOM() {
            return ["thead", 0]
        }
    }).addToEnd('table_body', {
        content: "table_row*",
        tableRole: "body",
        parseDOM: [{tag: "tbody"}],
        toDOM: function toDOM() {
            return ["tbody", 0]
        }
    }).addToEnd('table_foot', {
        content: "table_row*",
        tableRole: "foot",
        parseDOM: [{tag: "tfoot"}],
        toDOM: function toDOM() {
            return ["tfoot", 0]
        }
    }).addToEnd('image', {
        inline: true,
        attrs: {
            src: {},
            alt: {default: null},
            title: {default: null},
            width: {default: null},
            height: {default: null}
        },
        group: "inline",
        draggable: true,
        parseDOM: [{
            tag: "img[src]", getAttrs: function getAttrs(dom) {
                return {
                    src: dom.getAttribute("src"),
                    title: dom.getAttribute("title"),
                    alt: dom.getAttribute("alt"),
                    width: dom.getAttribute("width"),
                    height: dom.getAttribute("height")
                }
            }
        }],
        toDOM: function toDOM(node) {
            return ["img", node.attrs]
        }
    }).addToEnd('emoji', {
        attrs: {
            text: {},
            markup: {},
        },
        inline: true,
        group: "inline",
        toDOM: function toDOM(node) {
            return ['span', node.attrs.text]
        }
    });

let marks = schema.spec.marks.addToEnd('strikethrough', {
    parseDOM: [{tag: "s"}],
    toDOM: function toDOM() {
        return ["s"]
    }
});

// TODO: link => blank

let markdownSchema = new Schema({
    nodes: nodes,
    marks: marks
});

export {markdownSchema};