/*
 * @link https://www.humhub.org/
 * @copyright Copyright (c) 2017 HumHub GmbH & Co. KG
 * @license https://www.humhub.com/licences
 *
 */

import {Schema} from "prosemirror-model"
import {tableNodes} from "prosemirror-tables"

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

let schema = new Schema({
    nodes: {
        doc: {
            content: "block+"
        },

        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [{tag: "p"}],
            toDOM: function toDOM() {
                return ["p", 0]
            }
        },

        blockquote: {
            content: "block+",
            group: "block",
            parseDOM: [{tag: "blockquote"}],
            toDOM: function toDOM() {
                return ["blockquote", 0]
            }
        },

        horizontal_rule: {
            group: "block",
            parseDOM: [{tag: "hr"}],
            toDOM: function toDOM() {
                return ["div", ["hr"]]
            }
        },

        heading: {
            attrs: {level: {default: 1}},
            content: "inline*",
            group: "block",
            defining: true,
            parseDOM: [{tag: "h1", attrs: {level: 1}},
                {tag: "h2", attrs: {level: 2}},
                {tag: "h3", attrs: {level: 3}},
                {tag: "h4", attrs: {level: 4}},
                {tag: "h5", attrs: {level: 5}},
                {tag: "h6", attrs: {level: 6}}],
            toDOM: function toDOM(node) {
                return ["h" + node.attrs.level, 0]
            }
        },

        code_block: {
            content: "text*",
            group: "block",
            code: true,
            defining: true,
            attrs: {params: {default: ""}},
            parseDOM: [{
                tag: "pre", preserveWhitespace: true, getAttrs: function (node) {
                    return ({params: node.getAttribute("data-params")});
                }
            }],
            toDOM: function toDOM(node) {
                return ["pre", node.attrs.params ? {"data-params": node.attrs.params} : {}, ["code", 0]]
            }
        },

        ordered_list: {
            content: "list_item+",
            group: "block",
            attrs: {order: {default: 1}, tight: {default: false}},
            parseDOM: [{
                tag: "ol", getAttrs: function getAttrs(dom) {
                    return {
                        order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
                        tight: dom.hasAttribute("data-tight")
                    }
                }
            }],
            toDOM: function toDOM(node) {
                return ["ol", {
                    start: node.attrs.order == 1 ? null : node.attrs.order,
                    "data-tight": node.attrs.tight ? "true" : null
                }, 0]
            }
        },

        bullet_list: {
            content: "list_item+",
            group: "block",
            attrs: {tight: {default: false}},
            parseDOM: [{
                tag: "ul", getAttrs: function (dom) {
                    return ({tight: dom.hasAttribute("data-tight")});
                }
            }],
            toDOM: function toDOM(node) {
                return ["ul", {"data-tight": node.attrs.tight ? "true" : null}, 0]
            }
        },

        list_item: {
            content: "paragraph block*",
            defining: true,
            parseDOM: [{tag: "li"}],
            toDOM: function toDOM() {
                return ["li", 0]
            }
        },

        text: {
            group: "inline",
            toDOM: function toDOM(node) {
                return node.text
            }
        },

        image: {
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
        },

        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{tag: "br"}],
            toDOM: function toDOM() {
                return ["br"]
            }
        },

        oembed: {
            attrs: {
                href: {},
                dom: {default: null},
                txt: {default: 'test'}
            },
            atom: true,
            draggable: true,
            inline: true,
            group: "inline",
            parseDOM: [{
                tag: "[data-oembed]", getAttrs: function getAttrs(dom) {

                    return {
                        href: dom.getAttribute("data-oembed")
                    };
                }
            }],
            toDOM: function toDOM(node) {
                console.log('asdf');
                //todo: call humhub.oembed.get(url)
                let $oembed = $('[data-oembed="' + node.attrs.href + '"]');

                if ($oembed.length) {
                    return $oembed.clone().show()[0];
                } else {
                    return $('<a href="' + escapeHtml(node.attrs.href) + '" target="_blank" rel="noopener">' + escapeHtml(node.attrs.href) + '</a>')[0];
                }
            }
        },

        emoji: {
            attrs: {
                class: {default: 'emoji'},
                draggable: {default: 'false'},
                width: {default: '18'},
                height: {default: '18'},
                'data-name': {default: null},
                alt: {default: null},
                src: {default: null},
            },
            inline: true,
            group: "inline",
            parseDOM: [{
                tag: "img.emoji", getAttrs: function getAttrs(dom) {
                    return {
                        src: dom.getAttribute("src"),
                        alt: dom.getAttribute("alt"),
                        'data-name': dom.getAttribute('data-name')
                    }
                }
            }],
            toDOM: function toDOM(node) {
                return ['img', node.attrs]
            }
        }
    },

    marks: {
        em: {
            parseDOM: [{tag: "i"}, {tag: "em"},
                {
                    style: "font-style", getAttrs: function (value) {
                    return value == "italic" && null;
                }
                }],
            toDOM: function toDOM() {
                return ["em"]
            }
        },

        strong: {
            parseDOM: [{tag: "b"}, {tag: "strong"},
                {
                    style: "font-weight", getAttrs: function (value) {
                    return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
                }
                }],
            toDOM: function toDOM() {
                return ["strong"]
            }
        },

        strikethrough: {
            parseDOM: [{tag: "s"}],
            toDOM: function toDOM() {
                return ["s"]
            }
        },

        link: {
            attrs: {
                href: {},
                title: {default: null}
            },
            inclusive: false,
            parseDOM: [{
                tag: "a[href]", getAttrs: function getAttrs(dom) {
                    return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
                }
            }],
            toDOM: function toDOM(node) {
                return ["a", node.attrs]
            }
        },

        code: {
            parseDOM: [{tag: "code"}],
            toDOM: function toDOM() {
                return ["code"]
            }
        }
    }
});

let nodes = schema.spec.nodes
    .append(tableNodes({
        tableGroup: "block",
        cellContent: "paragraph+",
        cellAttributes: {
            style: {
                default: null,
                getFromDOM(dom) {
                    return dom.style;
                },
                setDOMAttr(value, attrs) {
                    if (value) {
                        attrs.style = value
                    }
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
    });

// TODO: link => blank

let markdownSchema = new Schema({
    nodes: nodes,
    marks: schema.spec.marks
});

export {markdownSchema};