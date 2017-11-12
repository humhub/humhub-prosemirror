/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {schema} from "prosemirror-markdown"
import {Schema} from "prosemirror-model"

let nodes = schema.spec.nodes.remove('image');

nodes = nodes.addToEnd('image', {
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
    parseDOM: [{tag: "img[src]", getAttrs: function getAttrs(dom) {
        return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt"),
            width: dom.getAttribute("width"),
            height: dom.getAttribute("height")
        }
    }}],
    toDOM: function toDOM(node) {return ["img", node.attrs]}
}).addToEnd('emoji', {
    attrs: {
        text: {},
        markup: {},
    },
    inline: true,
    group: "inline",
    toDOM: function toDOM(node) { return ['span', node.attrs.text ]}
});

// TODO: link => blank

let markdownSchema = new Schema({
    nodes: nodes,
    marks: schema.spec.marks
});

export {markdownSchema};